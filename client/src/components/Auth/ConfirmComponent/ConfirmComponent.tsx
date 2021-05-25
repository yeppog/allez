import React, { useState, useEffect } from 'react';
import './ConfirmComponent.scss';
import { useHistory, useParams } from 'react-router-dom';
import { ConfirmCredentials } from '../../../interface/Credentials';
import axios from 'axios'


interface Token {
  token: string;
}



const ConfirmComponent: React.FC = () => {
  const token = useParams<Token>() as ConfirmCredentials;
  /** State for conditional rendering */
  const [state, setState] = useState<string>('idle');
  const history = useHistory();


  useEffect(() => {
    /**
    * Sends a get request to the API server to activate the account
    * 
    * @param body Holds the token for the get request
    */
    const confirmUser = async (body: ConfirmCredentials) => {
      axios.defaults.baseURL = "http://localhost:3001"
      await axios.get("/api/users/confirm", { headers: { token: body.token } })
        .then(data => {
          setState("success")
          history.push('/login')
        })
        .catch(err => {
          setTimeout(() => history.push('/login'), 3000)
          console.log(err)
        });
    }
    confirmUser(token);
  }, [])

  return (
    <div className="ConfirmComponent" data-testid="ConfirmComponent">
      {state === "idle" ?
        <div>
          Loading
        </div>
        : state === "success" ?
          <div>
            Account activated
          </div>
          :
          <div>
            Error:
          </div>

      }
    </div>
  )
};

export default ConfirmComponent;
