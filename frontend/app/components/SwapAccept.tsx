import React from 'react';
import UserRating from './UserRating';

interface MessageProps {
  otherUser: any;
}

const SwapAccept: React.FC<MessageProps> = ({otherUser}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          border: '2px solid black',
          borderRadius: '15px',
          paddingTop: '20px',
          paddingBottom: '10px',
          margin: '20px',
          marginBottom: '10px',
          width: '100%',
          textAlign: 'center',
          color: '#3730A3',
          fontWeight: 'bold',
        }}
      >
        Swap Success!
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            color: 'black',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
              padding: '20px',
            }}
          >
            <div>You and Sohee saved:</div>
            <div className="text-yellow-500 text-3xl font-bold">220kg</div>
            <div>of CO2 waste</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
              padding: '20px',
            }}
          >
            <div>You've made:</div>
            <div className="text-yellow-500 text-3xl font-bold">21</div>
            <div>successful swaps</div>
          </div>
        </div>
      </div>
      <div
        style={{
          border: '2px solid black',
          borderRadius: '15px',
          padding: '5px',
          width: '100%',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {/* <UserRating otherUser={otherUser} size="text-2xl" /> */}
        
      </div>
    </div>
  );
};

export default SwapAccept;
