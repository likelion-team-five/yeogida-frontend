import React from 'react';
import { ReactComponent as StartLogo} from '../../image/start/여기다시작로고.svg';
import { ReactComponent as LogIn} from '../../image/start/카카오로그인.svg';

function Start() {
  return (
    <div className='container'>
      <div className='startlogo'>
        <StartLogo  width='470px' height='470px' />
      </div>
       <div className='login'>
        <LogIn width='105%' height='105%' />
      </div>
    </div>
  );
}

export default Start;