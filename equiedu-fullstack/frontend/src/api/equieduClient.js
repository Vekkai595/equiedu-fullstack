import { seedData } from '@/data/seedData';
import { authClient } from '@/api/authClient';

const STORAGE_PREFIX = 'equiedu.education-for-all.v3';
const DATA_VERSION = '3.0-teacher-validated-diagnostic';
const isBrowser = typeof window !== 'undefined';

const clone = (value) => JSON.parse(JSON.stringify(value ?? null));

const getStorage = () => {
  if (!isBrowser) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const keyFor = (entityName) => `${STORAGE_PREFIX}.${entityName}`;
const metaKey = `${STORAGE_PREFIX}.meta`;

const ensureMeta = () => {
  const storage = getStorage();
  if (!storage) return null;
  const current = storage.getItem(metaKey);
  const meta = current ? JSON.parse(current) : {
    project: 'EquiEdu',
    owner: 'Samuel Borba / vekkai595',
    team: 'Falcon Robots',
    backend: 'FastAPI auth + local-first educational data',
    data_version: DATA_VERSION,
    created_at: new Date().toISOString(),
  };
  meta.last_opened_at = new Date().toISOString();
  storage.setItem(metaKey, JSON.stringify(meta));
  return meta;
};

const readCollection = (entityName) => {
  const storage = getStorage();
  const fallback = clone(seedData[entityName] || []);

  if (!storage) return fallback;

  ensureMeta();
  const key = keyFor(entityName);
  const raw = storage.getItem(key);
  if (!raw) {
    storage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    storage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

const writeCollection = (entityName, records) => {
  const storage = getStorage();
  if (storage) {
    storage.setItem(keyFor(entityName), JSON.stringify(records));
    const meta = ensureMeta() || {};
    storage.setItem(metaKey, JSON.stringify({ ...meta, updated_at: new Date().toISOString() }));
  }
};

const normalizeSortValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'number') return value;
  const maybeDate = Date.parse(value);
  if (!Number.isNaN(maybeDate) && /\d{4}-\d{2}-\d{2}/.test(String(value))) return maybeDate;
  return String(value).toLocaleLowerCase('pt-BR');
};

const sortRecords = (records, sort = '-created_date') => {
  if (!sort) return records;
  const desc = String(sort).startsWith('-');
  const field = desc ? String(sort).slice(1) : String(sort);

  return [...records].sort((a, b) => {
    const av = normalizeSortValue(a[field]);
    const bv = normalizeSortValue(b[field]);
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
};

const createEntityApi = (entityName) => ({
  async list(sort = '-created_date', limit = 100) {
    const records = sortRecords(readCollection(entityName), sort);
    return Number.isFinite(limit) ? records.slice(0, limit) : records;
  },

  async get(id) {
    return readCollection(entityName).find((record) => record.id === id) || null;
  },

  async create(payload) {
    const records = readCollection(entityName);
    const now = new Date().toISOString();
    const record = {
      id: `${entityName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      created_date: now,
      updated_date: now,
      ...clone(payload),
    };
    records.unshift(record);
    writeCollection(entityName, records);
    return record;
  },

  async update(id, payload) {
    const records = readCollection(entityName);
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) throw new Error(`Registro não encontrado: ${id}`);
    records[index] = { ...records[index], ...clone(payload), updated_date: new Date().toISOString() };
    writeCollection(entityName, records);
    return records[index];
  },

  async upsert(id, payload) {
    const existing = await this.get(id);
    return existing ? this.update(id, payload) : this.create({ id, ...payload });
  },

  async delete(id) {
    const records = readCollection(entityName).filter((record) => record.id !== id);
    writeCollection(entityName, records);
    return { success: true };
  },

  async replace(records) {
    if (!Array.isArray(records)) throw new Error('A coleção precisa ser uma lista.');
    writeCollection(entityName, records);
    return records;
  },
});

const auth = authClient;

const entities = Object.keys(seedData).reduce((acc, entityName) => {
  acc[entityName] = createEntityApi(entityName);
  return acc;
}, {});

const getAllData = () => {
  const data = Object.keys(seedData).reduce((acc, entityName) => {
    acc[entityName] = readCollection(entityName);
    return acc;
  }, {});
  return {
    meta: ensureMeta() || {
      project: 'EquiEdu',
      owner: 'Samuel Borba / vekkai595',
      team: 'Falcon Robots',
      backend: 'FastAPI auth + local-first educational data',
      data_version: DATA_VERSION,
    },
    data,
  };
};

const importData = (payload) => {
  const imported = payload?.data || payload;
  if (!imported || typeof imported !== 'object') throw new Error('Arquivo inválido.');
  Object.keys(seedData).forEach((entityName) => {
    if (Array.isArray(imported[entityName])) writeCollection(entityName, imported[entityName]);
  });
  return getAllData();
};

const resetLocalData = ({ includeAuth = false } = {}) => {
  const storage = getStorage();
  if (!storage) return;
  Object.keys(seedData).forEach((entityName) => storage.removeItem(keyFor(entityName)));
  storage.removeItem(metaKey);
  storage.removeItem('equiedu-saved');
  storage.removeItem('equiedu-accessibility');
  if (includeAuth && isBrowser) {
    window.sessionStorage.removeItem('equiedu.auth.v1');
  }
};

const clearEverything = () => {
  const storage = getStorage();
  if (!storage) return;
  Object.keys(storage)
    .filter((key) => key.startsWith(STORAGE_PREFIX) || key.startsWith('equiedu-'))
    .forEach((key) => storage.removeItem(key));
  if (isBrowser) window.sessionStorage.removeItem('equiedu.auth.v1');
};

export const equiedu = {
  storagePrefix: STORAGE_PREFIX,
  dataVersion: DATA_VERSION,
  auth,
  entities,
  getAllData,
  importData,
  resetLocalData,
  clearEverything,
};
