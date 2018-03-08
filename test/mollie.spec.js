import chai from 'chai';
import {getSubscriptionStartDate} from '../src/mollie';

describe('mollie wrapper and util', function () {


  it('should get correct start date', async function () {
    chai.expect(getSubscriptionStartDate(new Date(2000, 0, 31) /* 31 jan*/)).to.equal('2000-03-01');
  });
});