import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@mui/material';
import './styles/main.css';
import {Redirect} from "react-router";

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from "./components/loginRegister/loginRegister";


class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page_content: undefined,
      user: undefined
    };
    this.changeTopbarContent = this.changeTopbarContent.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  changeTopbarContent = (page_content) => {
    this.setState({ page_content: page_content });
  };

  isUserLoggedIn(){
    return this.state.user !== undefined;
  }

  changeUser = (user) => {
    this.setState({user: user});
    if (user === undefined) this.changeTopbarContent(undefined);
  };

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar page_content={this.state.page_content} user={this.state.user} changeUser={this.changeUser} />
        </Grid>
        <div className="main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            {
              this.isUserLoggedIn() ? <UserList/> : <div></div>
            }
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Switch>
              {this.isUserLoggedIn() ?
                (
                <Route path="/users/:userId"
                  render={ props => <UserDetail {...props} changeTopbarContent={this.changeTopbarContent} /> }
                />
                )
              :
                <Redirect path="/users/:userId" to="/login-register" />}
              {
              this.isUserLoggedIn() ?
              (
              <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} changeTopbarContent={this.changeTopbarContent} /> }
              />
              )
              :
                    <Redirect path="/photos/:userId" to="/login-register" />
              }
              {
                this.isUserLoggedIn() ?
                    (
                        <Route path="/photos/:userId/:photoId"
                               render ={ props => <UserPhotos {...props} changeMainContent={this.changeMainContent} /> }
                        />
                    )
                    :
                    <Redirect path="/photos/:userId" to="/login-register" />
              }

              {this.isUserLoggedIn() ?
              (
              <Route exact path="/"
              />
              )
              :<Route path="/login-register" render ={ props => <LoginRegister {...props} changeUser={this.changeUser}/> } />}
              {this.isUserLoggedIn() ?
              (
                <Route exact path="/"
                />
              )
                :
                <Route path="/" render ={ props => <LoginRegister {...props} changeUser={this.changeUser}/> } />}
              {/* <Route path="/users" component={UserList}  /> */}
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
