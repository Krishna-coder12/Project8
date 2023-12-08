import React from 'react';
import {
  TextField,
  Button
} from '@mui/material';
import './userDetail.css';
import { Link } from 'react-router-dom';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios'; 

/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: undefined,
        recentPhoto: undefined,
        mostCommentedPhoto: undefined
    };
  }

componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
}

componentDidUpdate() {
  const new_user_id = this.props.match.params.userId;
  const current_user_id = this.state.userDetails?._id;
  if (current_user_id  !== new_user_id){
      this.handleUserChange(new_user_id);
  }
}

handleUserChange(user_id){
        axios.get("/user/" + user_id)
            .then((response) =>
            {
                const new_user = response.data;
                this.setState({
                    userDetails: new_user
                });

                // Fetch the most recently uploaded photo
                axios.get("/user/recentPhoto/" + user_id)
                    .then((response) => {
                        const recentPhoto = response.data;
                        this.setState({ recentPhoto });
                    })
                    .catch((error) => {
                        console.error("Error fetching recent photo", error);
                    });

                // Fetch the photo with the most comments
                axios.get("/user/mostCommentedPhoto/" + user_id)
                    .then((response) => {
                        const mostCommentedPhoto = response.data;
                        this.setState({ mostCommentedPhoto });
                    })
                    .catch((error) => {
                        console.error("Error fetching most commented photo", error);
                    });

                const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
                this.props.changeTopbarContent(main_content);
            });
    }
    navigateToUserPhotos = (photoId) => {
        // Assuming you have a route defined for the user photos view
        this.props.history.push(`/photos/${this.state.userDetails._id}/${photoId}`);
    };

    formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '');
        return formattedDate;
    }

    render() {
    const { userDetails } = this.state;
    return userDetails ? (
      <div>
        <Button
          variant="contained"
          size="medium"
          component={Link}
          to={`/photos/${userDetails._id}`}
          className="button"
        >
            USER PHOTOS
        </Button>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              {this.state.recentPhoto && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', marginRight: '50px' }}>
                      <div style={{ marginLeft: '10px', width: '250px' }}>
                          <TextField
                              disabled
                              id="outlined-disabled"
                              label="Recent Photo"
                              className="custom-field"
                              value={'Date Uploaded: ' + this.formatDate(this.state.recentPhoto.date_time)}
                          />
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                          <img
                              src={`images/${this.state.recentPhoto.file_name}`}
                              alt="Recent Photo"
                              onClick={() => this.navigateToUserPhotos(this.state.recentPhoto._id)}
                              style={{ width: '250px', height: '250px', borderStyle: "solid", borderColor: "grey" }}
                          />
                      </div>
                  </div>
              )}
              {this.state.mostCommentedPhoto && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ marginLeft: '10px', width: '250px' }}>
                          <TextField
                              disabled
                              id="outlined-disabled"
                              label="Most Commented Photo"
                              className="custom-field"
                              value={'Comments Count: ' + this.state.mostCommentedPhoto.commentCount}
                          />
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                          <img
                              src={`images/${this.state.mostCommentedPhoto.file_name}`}
                              alt="Most Commented Photo"
                              onClick={() => this.navigateToUserPhotos(this.state.mostCommentedPhoto._id)}
                              style={{ width: '250px', height: '250px', borderStyle: "solid", borderColor: "grey" }}
                          />
                      </div>
                  </div>
              )}
          </div>

          <TextField
          disabled
          fullWidth
          id="outlined-disabled"
          label="First Name"
          className="custom-field"
          value={userDetails.first_name}
        />
        <TextField
          disabled
          fullWidth
          id="outlined-disabled"
          label="Last Name"
          className="custom-field"
          value={userDetails.last_name}
        />
        <TextField
          disabled
          fullWidth
          id="outlined-disabled"
          label="Location"
          className="custom-field"
          value={userDetails.location}
        />
        <TextField
          disabled
          fullWidth
          id="outlined-disabled"
          label="Description"
          multiline
          rows={5}
          className="custom-field"
          value={userDetails.description}
        />
        <TextField
          disabled
          fullWidth
          id="outlined-disabled"
          label="Occupation"
          className="custom-field"
          value={userDetails.occupation}
        />

      </div>
    ) : (
      <div />
    );
  }
}

export default UserDetail;
