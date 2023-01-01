import React from 'react';
import { Container, Row, Col, FormGroup, Input, Label } from 'reactstrap';

const AppsMarket =  () => {
  return (
    <div id='appMarket' className='appMarket'>
      <Container>
        <div className='pageHeader'>
          <h2 className='pageTitle'>Apps Market</h2>

          <div className='pageNote d-flex justify-content-center align-items-center position-relative'>
            <div className='d-flex align-items-center justify-content-center'>
              <span className='githubIcon'><i className='fa fa-github'></i></span>
              <p className='noteText m-0'>See the changes your <strong>R&D</strong> makes and how they affect your <strong>sales</strong></p>
              <a href='/' className='btn btn-sm btn-primary'>Add</a>
            </div>
            <a href='/' className='btn-learnmore'>Learn more</a>
          </div>

          <form className='pageFilters d-flex justify-content-between align-items-center'>
            <FormGroup className='filter-sort position-relative'>
              <Label className='sr-only' for="dropdownFilters">sort by filter</Label>
              <i className='btn-searchIcon left-0'>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666"/>
                </svg>
              </i>
              <i className='btn-searchIcon right-0 fa fa-angle-down'></i>
              <Input type="select" name="select" id="dropdownFilters">
                <option>Sort by</option>
                <option>Asending</option>
                <option>Desending</option>
                <option>Name</option>
                <option>Date</option>
              </Input>
            </FormGroup>
            <FormGroup className='filter-search position-relative'>
              <Label className='sr-only' for="search">search</Label>
              <Input type="search" name="search" id="search" placeholder="with a placeholder" />
              <button className='btn-searchIcon'><img className='d-block' src='/search-new.svg' width='16' height='16' alt='Search'/></button>
            </FormGroup>
          </form>

          <h3 className='h3-title'>Recommended For You</h3>
        </div>
        <Row className='items'>
          {
            [
              {id: '01', background: 'null', enabled: true, premium: false, brandName: 'News Alerts', brandLogo: '/newsAlerts.svg'},
              {id: '02', background: '#00749a', enabled: true, premium: false, brandName: 'Wordpress', brandLogo: '/wordpress.svg'},
              {id: '03', background: 'null', enabled: true, premium: false, brandName: 'Rank Tracking SERP', brandLogo: '/serp.svg'},
              {id: '04', background: 'null', enabled: false, premium: false, brandName: 'Weather Alerts', brandLogo: '/weatherAlerts.svg'},
              {id: '05', background: 'null', enabled: false, premium: false, brandName: 'Google Updates', brandLogo: '/googleUpdates.svg'},
              {id: '06', background: 'null', enabled: false, premium: true, brandName: 'Google Ads', brandLogo: '/googleAds.svg'},
              {id: '07', background: '#004F9D', enabled: false, premium: true, brandName: 'Facebook Ads', brandLogo: '/facebookAds.svg'},
              {id: '08', background: 'radial-gradient(126.96% 126.96% at 6.47% 97.81%, #FA8F21 9%, #D82D7E 78%)', enabled: false, premium: false, brandName: 'Instagram', brandLogo: '/instagram.svg'},
              {id: '09', background: '#1DA1F2', enabled: false, premium: false, brandName: 'Twitter', brandLogo: '/twitter.svg'},
              {id: '10', background: '#411442', enabled: false, premium: false, brandName: 'slack', brandLogo: '/slack.svg'},
              {id: '11', background: '#F8761F', enabled: false, premium: false, brandName: 'Hubspot', brandLogo: '/hubspot.svg'},
              {id: '12', background: '#FF4A00', enabled: false, premium: false, brandName: 'Zapier', brandLogo: '/zapier.svg'},
              {id: '13', background: '#006192', enabled: false, premium: false, brandName: 'Linkedin', brandLogo: '/linkedin.svg'},
              {id: '14', background: '#03363D', enabled: false, premium: false, brandName: 'Zendesk', brandLogo: '/zendesk.svg'},
              {id: '15', background: '#00A1E0', enabled: false, premium: false, brandName: 'Salesforce', brandLogo: '/salesforce.svg'},
              {id: '16', background: '#2EBD59', enabled: false, premium: false, brandName: 'Sportfy Podcast', brandLogo: '/sportfyPodcast.svg'},
              {id: '17', background: 'null', enabled: false, premium: false, brandName: 'Apple Podcast', brandLogo: '/applePodcast.svg'},
              {id: '18', background: '#FF9900', enabled: false, premium: false, brandName: 'amazoon Podcast', brandLogo: '/amazonPodcast.svg'},
              {id: '19', background: '#24292F', enabled: false, premium: false, brandName: 'GitHub', brandLogo: '/github.svg'},
              {id: '20', background: 'null', enabled: false, premium: false, brandName: 'Shopify', brandLogo: '/shopify.svg'},
              {id: '21', background: '#2E3133', enabled: false, premium: false, brandName: 'WIX.com', brandLogo: '/wixCom.svg'},
              {id: '22', background: 'null', enabled: false, premium: false, brandName: 'ZOHO', brandLogo: '/zoho.svg'},
              {id: '23', background: 'null', enabled: false, premium: true, brandName: 'YouTube', brandLogo: '/youtube.svg'},
              {id: '24', background: 'null', enabled: false, premium: false, brandName: 'Retail Marketing Dates', brandLogo: '/retailMarketingDates.svg'},
              {id: '25', background: '#253858', enabled: false, premium: false, brandName: 'Bitbucket', brandLogo: '/bitbucket.svg'},
              {id: '26', background: 'null', enabled: false, premium: false, brandName: 'Google Tag Manager', brandLogo: '/googleTagManager.svg'},
              {id: '27', background: 'null', enabled: false, premium: false, brandName: 'Holidays', brandLogo: '/holidays.svg'},
              {id: '28', background: 'null', enabled: false, premium: false, brandName: 'Website Monitoring', brandLogo: '/websiteMonitoring.svg'},
              {id: '29', background: '#0A0A0A', enabled: false, premium: false, brandName: 'TikTok', brandLogo: '/tiktok.svg'}
            ].map((item, itemKey) => (<Col xs='3'>
              <div className='item' key={itemKey} style={{ 'background': item.background || '#fff', 'border-color': item.background || '#e0e0e0', }}>
                {item.enabled && <i class="active fa fa-check-circle"></i>}
                <img src={item.brandLogo} alt={item.brandName} className='svg-inject'/>
                { item.premium && <span className='btn-premium'><i className='fa fa-diamond'></i><span>Premium</span></span> }
              </div>
            </Col>))
          }
          {/* <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col>
          <Col xs='3'>
            <div className='item'>
              <i class="active fa fa-check-circle"></i>
              <h3 className='mb-0'>Item Box</h3>
            </div>
          </Col> */}
        </Row>
      </Container>
    </div>
  )
}

export default AppsMarket