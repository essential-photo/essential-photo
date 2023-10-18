import React from 'react';
import {Context} from '../context';
import {useNavigate} from 'react-router-dom';

// use this hook to call the API 
// this will handle tokens for you
// the request(s) will be initiated once setFetchParameters is called
// the resulting data will be placed in the data state variable
// isLoading can be used for loading status
// setFetchParameters.bodies is an array that can accept one or more request bodies
// a request will be generated for each body to permit batch requests (for example, 
// uploading multiple images at once)
// leave bodies blank for GET requests
// if any fetch responses are 401 (unauthorized), the global login state will be cleared
// and the user will be redirected to the login page

export default function useCallAPI() {
  const [fetchResults, setFetchResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchParameters, setFetchParameters] = React.useState({
    url: '',
    method: '',
    bodies: [],
  });

  const navigate = useNavigate();
  const {logout} = React.useContext(Context);

  function clearFetchResults() {
    setFetchResults([]);
  }

  function storeFetchResults(requestBody, responseStatus, parsedResponse) {
    setFetchResults( prevData => {
      const tempData = prevData.slice(0);
      let body; 

      if (requestBody){
        // convert requestBody formData object to JSON
        const obj = {};
        requestBody.forEach((value, key) => obj[key] = value);
        body = JSON.stringify(obj);
      }

      tempData.push({
        responseStatus: responseStatus,
        responseBody: parsedResponse,
        requestBody: body
      });
      return tempData;
    });
  }

  function updateTokens(response) {
    // update tokens if response sends new ones
    const accessToken = response.headers.get('access-token');
    const clientToken = response.headers.get('client');
    const uidToken = response.headers.get('uid');

    if (accessToken) {
      sessionStorage.setItem('access-token', accessToken);
    }

    if (clientToken) {
      sessionStorage.setItem('client', clientToken);
    }

    if (uidToken) {
      sessionStorage.setItem('uid', uidToken);
    }
  }

  React.useEffect(() => {
    async function callAPI(url, method, body) {
      const response = await fetch(url, {
        method: method,
        headers: {
          'access-token': sessionStorage.getItem('access-token'),
          'client': sessionStorage.getItem('client'),
          'uid': sessionStorage.getItem('uid'),
        },
        body: body,
      });

      const parsedResponse = await response.json();

      // if the response is a 401 (unauthorized), logout the user and redirect
      // to login page
      if (response.status === 401) {
        console.error('invalid credentials');
        logout();
        navigate("/login", {replace: true});
      }
      // otherwise, store the results of the fetch and update tokens
      else {
        // store the results of the fetch
        storeFetchResults(body, response.status, parsedResponse);
        
        // update tokens
        updateTokens(response);
      }
    }

    if (fetchParameters.url && fetchParameters.method) {
      // set loading state
      setIsLoading(true);

      // clear results
      setFetchResults([]);

      // send request(s)
      let promises = [];
      if (fetchParameters.method === 'GET' || fetchParameters.method === 'DELETE') {
        promises.push(callAPI(fetchParameters.url, fetchParameters.method, null));
      }
      else {
        promises = fetchParameters.bodies.map(body => {
          return callAPI(fetchParameters.url, fetchParameters.method, body);
        });
      }

      // once all fetches are done, set loading state to false
      Promise.all(promises)
      .then(() => {
        setIsLoading(false);
      });

      setFetchParameters({
        url: '',
        method: '',
        bodies: [],
      });
    }

  }, [fetchParameters, logout, navigate]);

  return {isLoading, fetchResults, clearFetchResults, setFetchParameters}
}