export class NotFoundError extends Error {
  constructor(entityName: string, id: number) {
    super(`${entityName} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}
