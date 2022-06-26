import {api} from '../../api'

export const DiseasesService = {
    diseasesWithCities: () => api.get("/diseases/cities")
}