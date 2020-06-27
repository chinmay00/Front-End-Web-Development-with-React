import React, {Component} from 'react';

import Home from './HomeComponent';

import Header from './HeaderComponent';
import Menu from './MenuComponent';
import DishDetail from './DishDetailComponent';
import Footer from './FooterComponenet';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {addComment, fetchDishes} from '../redux/ActionCreators';

import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { actions } from 'react-redux-form';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    leaders: state.leaders,
    promotions: state.promotions
  }
}

const mapDispatchToProps = dispatch => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  resetFeedBackForm: () => {dispatch(actions.reset('feedback'))}
})

class Main extends Component {

    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.fetchDishes();
    }

    render() {

      const HomePage = () => {
        return (
          <Home 
                dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishesErrMsg={this.props.dishes.err}
                promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}
          />
        );
      }

      const ContactUsPage = () => {
        return <Contact resetFeedBackForm={this.props.resetFeedBackForm}/>
      }

      const MenuPage = () => {
        return <Menu dishes={this.props.dishes} />
      }

      const DishPage = ({match}) => {
        return (
          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
            isLoading={this.props.dishes.isLoading}
            errMsg={this.props.dishes.err}
            comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
            addComment={this.props.addComment}
          />
        )
      }

      const AboutUsPage= () => {
        return <About leaders={this.props.leaders}/>
      }

      return (
        <div>
          <Header/>
          <Switch>
            <Route path="/home" component={HomePage}/>
            <Route exact path="/menu" component={MenuPage}/>
            <Route path="/menu/:dishId" component={DishPage}/>
            <Route path="/contactus" component={ContactUsPage}/>
            <Route path="/aboutus" component={AboutUsPage}/>
            <Redirect to="/home" />
          </Switch>
          <Footer/>
        </div>
      );
    }
  }
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));