const axios = require('axios')
const qs = require('qs')

class FootballData {
  constructor({token, timeout = 5000}) {
    this._axios = axios.create({
      baseURL: 'https://api.football-data.org/v2/',
      timeout,
      headers: {'X-Auth-Token': token}
    })
  }

  _get(url) {
    console.log('GET', url)
    return this._axios.get(url)
      .then(({headers, data}) => {
        console.log('x-requests-available-minute', Number.parseInt(headers['x-requests-available-minute']))
        console.log('x-requestcounter-reset', Number.parseInt(headers['x-requestcounter-reset']))
        return data
      })
  }

  competitions({areas, plan} = {}) {
    return this._get(`/competitions?${qs.stringify({areas: areas ? areas.join(',') : undefined, plan})}`)
      .then(data => data.competitions)
  }

  competition(competitionId) {
    return this._get(`/competitions/${competitionId}`)
  }

  teamsOfCompetition(competitionId, opts = {}) {
    const {season, stage} = opts
    const querystring = qs.stringify({season, stage})
    return this._get(`/competitions/${competitionId}/teams?${querystring}`)
      .then(data => data.teams)
  }

  standingsOfCompetition(competitionId, opts = {}) {
    const {standingType} = opts
    const querystring = qs.stringify({standingType})
    return this._get(`/competitions/${competitionId}/standings?${querystring}`)
      .then(data => data.standings)
  }

  matchesOfCompetition(competitionId, opts = {}) {
    const {dateFrom, dateTo, stage, status, matchday, group, season} = opts
    const querystring = qs.stringify({dateFrom, dateTo, stage, status, matchday, group, season})
    return this._get(`/competitions/${competitionId}/matches?${querystring}`)
      .then(data => data.matches)
  }

  scorersOfCompetition(competitionId, opts = {}) {
    const {limit} = opts
    const querystring = qs.stringify({limit})
    return this._get(`/competitions/${competitionId}/scorers?${querystring}`)
      .then(data => data.scorers)
  }

  matches(opts = {}) {
    const {competitions, dateFrom, dateTo, status} = opts
    const querystring = qs.stringify({competitions: competitions ? competitions.join(',') : undefined, dateFrom, dateTo, status})
    return this._get(`/matches?${querystring}`)
      .then(data => data.matches)
  }

  match(matchId) {
    return this._get(`/matches/${matchId}`)
  }

  matchesOfTeam(teamId, opts = {}) {
    const {dateFrom, dateTo, status, venue, limit} = opts
    const querystring = qs.stringify({dateFrom, dateTo, status, venue, limit})
    return this._get(`/teams/${teamId}/matches?${querystring}`)
      .then(data => data.matches)
  }

  team(teamId) {
    return this._get(`/teams/${teamId}`)
  }

  areas() {
    return this._get('/areas')
      .then(data => data.areas)
  }

  area(areaId) {
    return this._get(`/areas/${areaId}`)
  }

  player(playerId) {
    return this._get(`/players/${playerId}`)
  }

  matchesOfPlayer(playerId, opts = {}) {
    const {dateFrom, dateTo, status, competitions, limit} = opts
    const querystring = qs.stringify({dateFrom, dateTo, status, competitions: competitions ? competitions.join(',') : undefined, limit})
    return this._get(`/players/${playerId}/matches?${querystring}`)
      .then(data => data.matches)
  }
}

module.exports = FootballData
