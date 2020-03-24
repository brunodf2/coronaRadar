import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import Main from './pages/Main'

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'CoronaRadar'
      } 
    }
  }, {
    defaultNavigationOptions: {
      headerTintColor: '#FFF',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#07ed',

      }
    }
  })
)


export default Routes; 