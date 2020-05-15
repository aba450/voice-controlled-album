import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import Upload from "./Upload";
import useStyles from './App-Style.js';
import axios from "axios";
import MicRecorder from 'mic-recorder-to-mp3';
import './App.css';

var apigClientFactory = require('./apigClient').default;
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function App() {
  const classes = useStyles();
  const [query, setQuery] = React.useState()
  const [listening, setListening] = React.useState(false);
  const [apigClient, setApigClient] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [blobURL, setBlobURL] = React.useState('');
  const [isBlocked, setisBlocked] = React.useState(false);


  const handleSpeechSearch = (event) => {
    console.log(listening ? query : "Microphone is not on")
  }

  const toggleListen = () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          setIsRecording(true);
        }).catch((e) => console.error(e));
    }
    // handleSpeechSearch()
  }

  const micOff = () => {

      Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        setBlobURL(false)
        setIsRecording(false)
      }).catch((e) => console.log(e));

  }

  // Mp3Recorder
  //     .stop()
  //     .getMp3()
  //     .then(([buffer, blob]) => {
  //       const blobURL = URL.createObjectURL(blob)
  //       this.setState({ blobURL, isRecording: false });
  //     }).catch((e) => console.log(e));

  useEffect(() => {

    var apigClient = apigClientFactory.newClient({
      apiKey: 'hQxkihMJDJ1nF1Wjzysxs9VbL0stCjE4fFRLkorc'
    });

    setApigClient(apigClient)
    console.log(apigClient)
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setisBlocked(false)
      },
      () => {
        console.log('Permission Denied');
        setisBlocked(true)
      },
    );

  }, []);

  const handleTextSearch = (event) => { 
    console.log(query)
    const searchQuery = "dog";
    const params = {q: searchQuery};
    apigClient.searchGet(params, {}, {})
    .then((response) => {
      console.log(response)
    })
    .catch((result) => {
      console.error(result);
    });
    // axios({
    //   method: 'get',
    //   url: 'https://gf1tccyqza.execute-api.us-east-1.amazonaws.com/Dev/search/q=${val}&api_key=dbc0a6d62448554c27b6167ef7dabb1b`'
    // })
    //   .then(function (response) {
    //     console.log(response)
    //   });
  }

  const imagesList = ["https://b2-photo-bucket.s3.amazonaws.com/luca-bravo-TaCk3NspYe0-unsplash.jpg",
  "https://b2-photo-bucket.s3.amazonaws.com/dog_1.jpg"
]

let images = imagesList.map(image => {
  return <img key={image} src={image} alt="" className="images" />
});


  return (
    <div className="App">
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h6" noWrap>
            Photo Album
          </Typography>
          <div className={classes.search}>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={event=>{                               
              setQuery(event.target.value)            
        }}
            />
            <Tooltip title = "Search">
            <IconButton className={classes.icons} aria-label="search" onClick={handleTextSearch}>
              <SearchIcon />
      </IconButton>
      </Tooltip>
      <Tooltip title = "Voice Search">
      <IconButton className={classes.icons} aria-label="search" onClick={toggleListen}>
        <MicIcon />
      </IconButton>
      </Tooltip>
      <Tooltip title = "Stop recording">
      <IconButton className={classes.icons} aria-label="search" onClick={micOff}>
      <MicOffIcon />
      </IconButton>
      </Tooltip>
      <audio src={blobURL} controls="controls" />
      
          </div>
          <div className={classes.grow} />
        </Toolbar>
        
      </AppBar>
      
      <div className="Card">
          <Upload />
          <div className="imagesDiv">
                       { images }
                    </div>       
      </div>

    </div>
    </div>
  );
}
