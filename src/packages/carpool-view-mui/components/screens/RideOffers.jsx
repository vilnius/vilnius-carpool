import React from 'react'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider'
import Avatar from 'material-ui/lib/avatar';
import TopBar from './components/TopBar'
import BottomTabs from './components/BottomTabs'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import HamburgerMenuButton from './components/HamburgerMenuButton'
import RepeatingDays from './components/RepeatingDays'
import wrapMobileLayout from './NewMobileWrap'
import config from './config'
import muiTheme from './muiTheme'
import ThemeManager from 'material-ui/lib/styles/theme-manager';

function getRandomBool() {
  return Math.random() < 0.5
}

const offers = [{
  image: 'http://lorempixel.com/200/200/people/0',
  name: 'Ana',
}, {
  image: 'http://lorempixel.com/200/200/people/1',
  name: 'Bob',
}, {
  image: 'http://lorempixel.com/200/200/people/2',
  name: 'Caithlyn',
}, {
  image: 'http://lorempixel.com/200/200/people/3',
  name: 'David',
}, {
  image: 'http://lorempixel.com/200/200/people/4',
  name: 'Erik',
}, {
  image: 'http://lorempixel.com/200/200/people/5',
  name: 'Frank',
}, {
  image: 'http://lorempixel.com/200/200/people/6',
  name: 'George',
},{
  image: 'http://lorempixel.com/200/200/people/7',
  name: 'Harry',
}]

export default class RideOffers extends React.Component {

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    }
  }

  render () {
    return (
      <div style={{paddingBottom: 64}}>
        <TopBar
          extraContent ={(
            <Tabs>
              <Tab label="All" />
              <Tab label="Yours" />
            </Tabs>
          )}
          middleContent="RideOffers"
          leftIcon={<HamburgerMenuButton />}
          rightIcon={<SearchIcon color="white" />}
        />
        <List style={{marginTop: 45 + 48}}>
          {offers.map((offer) => {
            return (
              [<ListItem key={1}
                onClick={() => muiControllerHelper.goToView('MuiRequestRide')}
                rightAvatar={
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 4, height: '100%'}}>
                    <Avatar src={offer.image} size={50} />
                    <span style={{fontSize: 11, marginTop: 5, color: config.colors.textColor, fontWeight: 500}}>{offer.name}</span>
                  </div>
                }
              >
                <div style={{display: 'flex', flexDirection: 'column', color: config.colors.textColor}}>
                  <div style={{marginBottom: 7, fontSize: 13}}>From gatves g. 12 8:30</div>
                  <div style={{marginBottom: 10, fontSize: 13}}>To prospekto pr. 57 ~9:00</div>
                  <div>{Math.random() > 0.6 ? (
                    <span style={{fontSize: 12}}>Jun 18, 2016</span>
                  ) : (
                    <RepeatingDays daysActive={[getRandomBool(), getRandomBool(), getRandomBool(),
                      getRandomBool(), getRandomBool(), getRandomBool(), getRandomBool()]}
                    />
                  )}</div>
                </div>
              </ListItem>,
              <Divider key={2}/>]
            )
          })}
        </List>
        <BottomTabs />
        <FloatingActionButton primary style={{
            position: 'fixed',
            right: 12,
            bottom: 75,
          }}
          onClick={() => muiControllerHelper.goToView('NewRideOffer')}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

RideOffers.childContextTypes = {
  muiTheme: React.PropTypes.object,
}

RideOffersScreen = RideOffers
