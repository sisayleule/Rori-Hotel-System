const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.resolve(__dirname, '../database');
console.log(`[MockMongoose] Initializing local JSON database directory at: ${DB_DIR}`);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function loadData(modelName) {
  const filePath = path.join(DB_DIR, `${modelName}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`[MockMongoose] Error loading database file ${modelName}.json:`, err);
    return [];
  }
}

function saveData(modelName, data) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const filePath = path.join(DB_DIR, `${modelName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`[MockMongoose] Error saving database file ${modelName}.json:`, err);
  }
}

function compileQuery(queryObj) {
  if (!queryObj) return () => true;
  return (item) => {
    if (Object.keys(queryObj).length === 0) return true;

    for (let key in queryObj) {
      const matchVal = queryObj[key];

      if (key === '$or') {
        if (!Array.isArray(matchVal)) return false;
        const isOrMatched = matchVal.some(subQuery => compileQuery(subQuery)(item));
        if (!isOrMatched) return false;
        continue;
      }

      if (key === '$and') {
        if (!Array.isArray(matchVal)) return false;
        const isAndMatched = matchVal.every(subQuery => compileQuery(subQuery)(item));
        if (!isAndMatched) return false;
        continue;
      }

      const itemVal = item[key];

      if (matchVal && typeof matchVal === 'object') {
        if ('$in' in matchVal) {
          const arr = matchVal['$in'];
          if (!Array.isArray(arr)) return false;
          const keyStr = itemVal !== undefined ? String(itemVal) : '';
          const exists = arr.some(el => String(el) === keyStr);
          if (!exists) return false;
          continue;
        }
        if ('$gte' in matchVal) {
          if (itemVal === undefined || !(itemVal >= matchVal['$gte'])) return false;
          continue;
        }
        if ('$lte' in matchVal) {
          if (itemVal === undefined || !(itemVal <= matchVal['$lte'])) return false;
          continue;
        }
        if ('$ne' in matchVal) {
          if (itemVal !== undefined && String(itemVal) === String(matchVal['$ne'])) return false;
          continue;
        }
      }

      if (matchVal === undefined) continue;
      if (itemVal === undefined) return false;

      // Compare string representations to support ObjectIDs or mixed types smoothly
      if (String(itemVal) !== String(matchVal)) {
        return false;
      }
    }
    return true;
  };
}

class MockQuery {
  constructor(modelName, filterFn) {
    this.modelName = modelName;
    this.filterFn = filterFn;
    this.sortFn = null;
    this.limitVal = null;
    this.populatePaths = [];
  }

  populate(path, select) {
    if (typeof path === 'object' && path !== null) {
      this.populatePaths.push({ path: path.path, select: path.select });
    } else {
      this.populatePaths.push({ path, select });
    }
    return this;
  }

  sort(sortObj) {
    this.sortFn = (a, b) => {
      for (let key in sortObj) {
        const order = sortObj[key];
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return order === -1 || order === 'desc' ? 1 : -1;
        if (valA > valB) return order === -1 || order === 'desc' ? -1 : 1;
      }
      return 0;
    };
    return this;
  }

  limit(val) {
    this.limitVal = val;
    return this;
  }

  async exec() {
    try {
      let data = loadData(this.modelName);
      
      if (this.filterFn) {
        data = data.filter(this.filterFn);
      }
      
      if (this.sortFn) {
        data.sort(this.sortFn);
      }
      
      if (this.limitVal !== null) {
        data = data.slice(0, this.limitVal);
      }
      
      for (let pop of this.populatePaths) {
        let refModelName = '';
        if (pop.path === 'userId') refModelName = 'User';
        else if (pop.path === 'studentId') refModelName = 'Student';
        else if (pop.path === 'supervisorId') refModelName = 'User';
        
        if (refModelName) {
          const refData = loadData(refModelName);
          for (let doc of data) {
            const foreignId = doc[pop.path];
            if (foreignId) {
              const refDoc = refData.find(item => String(item._id) === String(foreignId));
              if (refDoc) {
                let populatedObj;
                if (pop.select) {
                  const selectFields = pop.select.split(' ');
                  const subDoc = { _id: refDoc._id };
                  selectFields.forEach(f => { if (f) subDoc[f] = refDoc[f]; });
                  populatedObj = subDoc;
                } else {
                  populatedObj = { ...refDoc };
                }
                
                // Deep nest population for studentId -> populate inner userId
                if (pop.path === 'studentId') {
                  const usersData = loadData('User');
                  const studentUserId = populatedObj.userId;
                  if (studentUserId) {
                    const userDoc = usersData.find(item => String(item._id) === String(studentUserId));
                    if (userDoc) {
                      populatedObj.userId = { ...userDoc };
                    }
                  }
                }
                
                doc[pop.path] = populatedObj;
              }
            }
          }
        }
      }
      
      const ModelClass = mongooseModels[this.modelName];
      if (!ModelClass) {
        console.warn(`[MockMongoose] Model class for "${this.modelName}" not compiled yet. Returning plain objects.`);
        return data;
      }
      return data.map(item => new ModelClass(item));
    } catch (err) {
      console.error(`[MockMongoose] Error inside query execution for ${this.modelName}:`, err);
      throw err;
    }
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }
}

class MockModel {
  constructor(data) {
    this._id = data._id || uuidv4();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    Object.assign(this, data);
  }

  async save() {
    try {
      const data = loadData(this.constructor.modelName);
      const index = data.findIndex(item => String(item._id) === String(this._id));
      
      this.updatedAt = new Date().toISOString();
      
      const plainData = {};
      for (let key in this) {
        if (typeof this[key] !== 'function' && key !== 'constructor') {
          plainData[key] = this[key];
        }
      }
      
      if (index >= 0) {
        data[index] = plainData;
      } else {
        data.push(plainData);
      }
      
      saveData(this.constructor.modelName, data);
      return this;
    } catch (err) {
      console.error(`[MockMongoose] Error saving model instance of ${this.constructor.modelName}:`, err);
      throw err;
    }
  }

  toObject() {
    const obj = {};
    for (let key in this) {
      if (typeof this[key] !== 'function') {
        obj[key] = this[key];
      }
    }
    return obj;
  }

  toJSON() {
    return this.toObject();
  }

  static find(queryObj) {
    return new MockQuery(this.modelName, compileQuery(queryObj));
  }

  static findOne(queryObj) {
    const query = new MockQuery(this.modelName, compileQuery(queryObj));
    const originalExec = query.exec.bind(query);
    query.exec = async () => {
      const results = await originalExec();
      return results.length > 0 ? results[0] : null;
    };
    return query;
  }

  static findById(id) {
    return this.findOne({ _id: id });
  }

  static async create(data) {
    try {
      const isArray = Array.isArray(data);
      const arr = isArray ? data : [data];
      const createdArr = [];
      
      const dbData = loadData(this.modelName);
      
      for (let item of arr) {
        const doc = new this(item);
        dbData.push(doc.toObject());
        createdArr.push(doc);
      }
      
      saveData(this.modelName, dbData);
      return isArray ? createdArr : createdArr[0];
    } catch (err) {
      console.error(`[MockMongoose] Error in create on model ${this.modelName}:`, err);
      throw err;
    }
  }

  static async findOneAndUpdate(queryObj, updateFields, options = {}) {
    try {
      const dbData = loadData(this.modelName);
      const filterFn = compileQuery(queryObj);
      const index = dbData.findIndex(filterFn);
      
      let finalUpdates = updateFields;
      if (updateFields && '$set' in updateFields) {
        finalUpdates = updateFields['$set'];
      }
      
      if (index >= 0) {
        const oldDoc = dbData[index];
        const updatedDoc = { ...oldDoc, ...finalUpdates, updatedAt: new Date().toISOString() };
        dbData[index] = updatedDoc;
        saveData(this.modelName, dbData);
        
        const returnDoc = options.new ? updatedDoc : oldDoc;
        return new this(returnDoc);
      }
      
      if (options.upsert) {
        const newDoc = new this({ ...queryObj, ...finalUpdates });
        dbData.push(newDoc.toObject());
        saveData(this.modelName, dbData);
        return newDoc;
      }
      
      return null;
    } catch (err) {
      console.error(`[MockMongoose] Error in findOneAndUpdate on model ${this.modelName}:`, err);
      throw err;
    }
  }

  static async findByIdAndUpdate(id, updateFields, options) {
    return this.findOneAndUpdate({ _id: id }, updateFields, options);
  }

  static async updateMany(queryObj, updateFields) {
    try {
      const dbData = loadData(this.modelName);
      const filterFn = compileQuery(queryObj);
      let matchedCount = 0;
      
      let finalUpdates = updateFields;
      if (updateFields && '$set' in updateFields) {
        finalUpdates = updateFields['$set'];
      }
      
      dbData.forEach((item, idx) => {
        if (filterFn(item)) {
          dbData[idx] = { ...item, ...finalUpdates, updatedAt: new Date().toISOString() };
          matchedCount++;
        }
      });
      
      if (matchedCount > 0) {
        saveData(this.modelName, dbData);
      }
      return { nModified: matchedCount, modifiedCount: matchedCount };
    } catch (err) {
      console.error(`[MockMongoose] Error in updateMany on model ${this.modelName}:`, err);
      throw err;
    }
  }

  static async deleteMany(queryObj) {
    try {
      const dbData = loadData(this.modelName);
      const filterFn = compileQuery(queryObj);
      const remaining = dbData.filter(item => !filterFn(item));
      const deletedCount = dbData.length - remaining.length;
      saveData(this.modelName, remaining);
      return { deletedCount };
    } catch (err) {
      console.error(`[MockMongoose] Error in deleteMany on model ${this.modelName}:`, err);
      throw err;
    }
  }

  static async deleteOne(queryObj) {
    try {
      const dbData = loadData(this.modelName);
      const filterFn = compileQuery(queryObj);
      const index = dbData.findIndex(filterFn);
      let deletedCount = 0;
      if (index >= 0) {
        dbData.splice(index, 1);
        saveData(this.modelName, dbData);
        deletedCount = 1;
      }
      return { deletedCount };
    } catch (err) {
      console.error(`[MockMongoose] Error in deleteOne on model ${this.modelName}:`, err);
      throw err;
    }
  }

  static async countDocuments(queryObj) {
    try {
      const dbData = loadData(this.modelName);
      const filterFn = compileQuery(queryObj);
      return dbData.filter(filterFn).length;
    } catch (err) {
      console.error(`[MockMongoose] Error in countDocuments on model ${this.modelName}:`, err);
      throw err;
    }
  }
}

const connection = {
  once: (event, callback) => {
    if (event === 'open') {
      setTimeout(() => {
        try {
          callback();
        } catch (e) {
          console.error('[MockMongoose] Error in connection open callback:', e);
        }
      }, 50);
    }
  },
  on: (event, callback) => {},
  db: {
    admin: () => ({
      ping: async () => true
    })
  }
};

const mongooseModels = {};

function compileSchema(obj, options) {
  return { obj, options };
}

compileSchema.Types = {
  ObjectId: String,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date
};

const mockMongoose = {
  Schema: compileSchema,
  model: (modelName, schema) => {
    if (mongooseModels[modelName]) {
      return mongooseModels[modelName];
    }
    class CompiledModel extends MockModel {}
    CompiledModel.modelName = modelName;
    CompiledModel.schema = schema;
    mongooseModels[modelName] = CompiledModel;
    return CompiledModel;
  },
  connect: async () => {
    console.log('[MockMongoose] Connected to offline database successfully!');
    return true;
  },
  connection: connection,
  Types: {
    ObjectId: String
  }
};

mockMongoose.Schema.Types = compileSchema.Types;

module.exports = mockMongoose;
