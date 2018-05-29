/* eslint-disable no-undef */
import chai from 'chai'
// eslint-disable-next-line camelcase
import {premium_SiteMap} from '../Backend/routers'

describe('sitemap', function () {
  it('should return a sitemap with one entry', async function () {
    const sitemap = await premium_SiteMap()
    chai.expect(sitemap).to.be.an('array')
    chai.expect(sitemap).to.have.lengthOf(1)
  })
})
