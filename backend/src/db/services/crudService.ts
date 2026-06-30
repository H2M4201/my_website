import { NotFoundError } from '../dtos'

export interface CrudServiceConfig<T, CreateDTO, UpdateDTO> {
  model: {
    findMany: (opts?: any) => Promise<any[]>
    findUnique: (opts: { where: any }) => Promise<any>
    create: (opts: { data: any }) => Promise<any>
    update: (opts: { where: any; data: any }) => Promise<any>
    delete: (opts: { where: any }) => Promise<any>
    deleteMany: (opts?: any) => Promise<any>
  }
  entityName: string
  NotFoundError: new (id: number) => NotFoundError
  mapToDTO: (record: any) => T
  mapCreateData: (data: CreateDTO) => any
  mergeUpdateData: (existing: any, data: UpdateDTO) => any
  orderBy?: any
}

export interface CrudService<T, CreateDTO, UpdateDTO> {
  getAll: () => Promise<T[]>
  getAllIncludingInactive: () => Promise<T[]>
  getById: (id: number) => Promise<T>
  create: (data: CreateDTO) => Promise<T>
  update: (id: number, data: UpdateDTO) => Promise<T>
  delete: (id: number) => Promise<void>
  deleteAll: () => Promise<void>
}

export function createCrudService<T, CreateDTO, UpdateDTO>(
  config: CrudServiceConfig<T, CreateDTO, UpdateDTO>
): CrudService<T, CreateDTO, UpdateDTO> {
  const {
    model,
    entityName,
    NotFoundError: NotFoundErrorClass,
    mapToDTO,
    mapCreateData,
    mergeUpdateData,
    orderBy = { id: 'asc' },
  } = config

  async function getAll(): Promise<T[]> {
    try {
      const records = await model.findMany({ where: { IsActive: true }, orderBy })
      return records.map(mapToDTO)
    } catch (error) {
      console.error(`Error fetching active ${entityName}s:`, error)
      throw new Error(`Failed to fetch ${entityName}s from database`)
    }
  }

  async function getAllIncludingInactive(): Promise<T[]> {
    try {
      const records = await model.findMany({ orderBy })
      return records.map(mapToDTO)
    } catch (error) {
      console.error(`Error fetching ${entityName}s:`, error)
      throw new Error(`Failed to fetch ${entityName}s from database`)
    }
  }

  async function getById(id: number): Promise<T> {
    try {
      const record = await model.findUnique({ where: { id } })
      if (!record) {
        throw new NotFoundErrorClass(id)
      }
      return mapToDTO(record)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      console.error(`Error fetching ${entityName}:`, error)
      throw new Error(`Failed to fetch ${entityName} from database`)
    }
  }

  async function create(data: CreateDTO): Promise<T> {
    try {
      const record = await model.create({ data: mapCreateData(data) })
      return mapToDTO(record)
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error)
      throw new Error(`Failed to create ${entityName} in database`)
    }
  }

  async function update(id: number, data: UpdateDTO): Promise<T> {
    try {
      const existing = await model.findUnique({ where: { id } })
      if (!existing) {
        throw new NotFoundErrorClass(id)
      }
      const merged = mergeUpdateData(existing, data)
      console.log(`[crudService] ${entityName}.update id=${id} input=`, JSON.stringify(data))
      console.log(`[crudService] ${entityName}.update id=${id} merged=`, JSON.stringify(merged))
      const record = await model.update({ where: { id }, data: merged })
      const dto = mapToDTO(record)
      console.log(`[crudService] ${entityName}.update id=${id} result=`, JSON.stringify(dto))
      return dto
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      console.error(`Error updating ${entityName}:`, error)
      throw new Error(`Failed to update ${entityName} in database`)
    }
  }

  async function del(id: number): Promise<void> {
    try {
      const existing = await model.findUnique({ where: { id } })
      if (!existing) {
        throw new NotFoundErrorClass(id)
      }
      await model.delete({ where: { id } })
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      console.error(`Error deleting ${entityName}:`, error)
      throw new Error(`Failed to delete ${entityName} from database`)
    }
  }

  async function deleteAll(): Promise<void> {
    try {
      await model.deleteMany()
    } catch (error) {
      console.error(`Error deleting all ${entityName}s:`, error)
      throw new Error(`Failed to delete all ${entityName}s from database`)
    }
  }

  return { getAll, getAllIncludingInactive, getById, create, update, delete: del, deleteAll }
}
