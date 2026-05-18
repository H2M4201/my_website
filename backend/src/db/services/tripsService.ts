import { prisma } from '../prisma'
import { TripDTO, CreateTripDTO, UpdateTripDTO, TripNotFoundError } from '../dtos'

function mapTripToDTO(trip: {
  id: number
  Title: string
  Time: string | null
  Location: string | null
  Content: string | null
}): TripDTO {
  return {
    id: trip.id,
    title: trip.Title,
    time: trip.Time,
    location: trip.Location,
    content: trip.Content,
  }
}

export async function getAllTrips(): Promise<TripDTO[]> {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { id: 'asc' },
    })
    return trips.map(mapTripToDTO)
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw new Error('Failed to fetch trips from database')
  }
}

export async function getTripById(id: number): Promise<TripDTO> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
    })

    if (!trip) {
      throw new TripNotFoundError(id)
    }

    return mapTripToDTO(trip)
  } catch (error) {
    if (error instanceof TripNotFoundError) throw error
    console.error('Error fetching trip:', error)
    throw new Error('Failed to fetch trip from database')
  }
}

export async function createTrip(data: CreateTripDTO): Promise<TripDTO> {
  try {
    const trip = await prisma.trip.create({
      data: {
        Title: data.title,
        Time: data.time || null,
        Location: data.location || null,
        Content: data.content || null,
      },
    })
    return mapTripToDTO(trip)
  } catch (error) {
    console.error('Error creating trip:', error)
    throw new Error('Failed to create trip in database')
  }
}

export async function updateTrip(
  id: number,
  data: UpdateTripDTO
): Promise<TripDTO> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
    })

    if (!trip) {
      throw new TripNotFoundError(id)
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        Title: data.title !== undefined ? data.title : trip.Title,
        Time: data.time !== undefined ? data.time : trip.Time,
        Location:
          data.location !== undefined ? data.location : trip.Location,
        Content: data.content !== undefined ? data.content : trip.Content,
      },
    })

    return mapTripToDTO(updated)
  } catch (error) {
    if (error instanceof TripNotFoundError) throw error
    console.error('Error updating trip:', error)
    throw new Error('Failed to update trip in database')
  }
}

export async function deleteTrip(id: number): Promise<void> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
    })

    if (!trip) {
      throw new TripNotFoundError(id)
    }

    await prisma.trip.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof TripNotFoundError) throw error
    console.error('Error deleting trip:', error)
    throw new Error('Failed to delete trip from database')
  }
}

export async function deleteAllTrips(): Promise<void> {
  try {
    await prisma.trip.deleteMany()
  } catch (error) {
    console.error('Error deleting all trips:', error)
    throw new Error('Failed to delete all trips from database')
  }
}
