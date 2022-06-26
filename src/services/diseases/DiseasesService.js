import {api} from '../../api'

export const DiseasesService = {
    diseases: () => api.get('/diseases'),
    diseasesWithCities: () => api.get("/diseases/cities"),
}