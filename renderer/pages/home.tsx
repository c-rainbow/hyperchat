import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Client } from 'tmi.js'
import tr from 'googletrans';
import { franc, francAll } from 'franc';

function Home() {

  const client = new Client({
    channels: [ 'c_rainbow' ]
  });
  
  client.connect();
  
  client.on('message', async (channel, userstate, message, self) => {
    console.log('channel:', channel);
    console.log('userstate:', userstate);
    console.log('message:', message);
    console.log('self:', self);

    const langDetected = francAll(message, {
      minLength: 2,
      only: [
        'eng',
        'kor',
        'cmn',
        'jpn',
        'fra',
      ]
    });

    console.log(langDetected)
    
    const result = await fetch(`/api/user?message=${message}`);
    console.log(await result.json());
    
  });

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className='grid grid-col-1 text-2xl w-full text-center'>
        <img className='ml-auto mr-auto' src='/images/logo.png' />
        <span>⚡ Electron ⚡</span>
        <span>+</span>
        <span>Next.js</span>
        <span>+</span>
        <span>tailwindcss</span>
        <span>=</span>
        <span>💕 </span>
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'>
        <Link href='/api/user'>
          <a className='btn-blue'>Go to next page</a>
        </Link>
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'>
        <Link href='/next'>
          <a className='btn-blue'>Go to next page</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Home;