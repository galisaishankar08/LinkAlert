import React, { useState } from "react";
import Axios from "axios";
import { FaSearch } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { CircularProgressbarWithChildren , buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './App.css';
import Logo from './images/linkalert-logo.png'

const domainPattern = /^((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

function App() {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    title: '',
    detection: '',
    tags: [],
    communityScore: 0,
    totalvendors: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const baseUrl = 'https://www.virustotal.com/api/v3';
    const apiKey = '01f27a93263f296b3565a2dfeae44d7e38df5da9895f22e5a8e0988d689e4547';

    const headers = {
      'x-apikey': apiKey
    };

    let surl = ''
    let domain = ''
    if(domainPattern.test(url)){
      domain = url;
      surl = `${baseUrl}/domains/${url}`;
    }
    else{
      domain = new URL(url).hostname
      console.log(domain)
      let base64Url = btoa(domain);
      // Remove padding characters
      let urlId = base64Url.replace(/=+$/, "");
      console.log(urlId)
      surl = `${baseUrl}/urls/${urlId}`;
    }
    

    Axios.get(surl, { headers })
      .then(response => {
        if (response.status === 200) {
          const result = response.data.data.attributes;
          const tags = [];

          for (const [key, value] of Object.entries(result.last_analysis_results)) {
            if (value.category !== 'harmless' && value.category !== "undetected") {
              tags.push(value.result);
            }
          }

          const threats = [...new Set(tags)];
          const malicious = result.last_analysis_stats.malicious;
          const flag = malicious > 0 ? `${malicious} security vendors flagged this URL as malicious` : `No security vendors flagged this domain as malicious`;
          
          setSubmitted(true);
          setData({
            title: result.title ? result.title : domain,
            detection: flag,
            tags: threats,
            communityScore: malicious,
            totalvendors: Object.keys(result.last_analysis_results).length,
          });
        } else {
          console.log('Failed to scan URL');
        }
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
    });
  }

  return (
    <div className="">
        <div className="p-10 grid grid-cols-1 gap-5 justify-center items-center md:grid-cols-3 lg:grid-cols-4">
          <img src={Logo} alt="Logo" className="w-[250px]"/>
          <form onSubmit={handleSubmit} className="col-span-2 flex items-center">
            <input type="text" placeholder="URL, Domain" onChange={(e) => setUrl(e.target.value)} className="pl-4 pr-14 py-2 h-14 w-full rounded-3xl bg-white bg-opacity-40 outline-none text-white text-opacity-70 md:text-[20px] lg:text[25px]"/>
            <label className='relative z-10 right-12 cursor-pointer'>
                <input hidden type='submit' />
                <FaSearch color='#FFFFFF' size='26' className=""/>
              </label>
          </form>
        </div>

        {
          submitted ?
          <h1 className={ data.communityScore>0 ? 'flex items-center justify-center md:text-3xl gap-1 text-red' : 'flex items-center justify-center md:text-3xl gap-1 text-green'}><BiErrorCircle />{data.detection}</h1>
          :
          <div />
        }
        

        <div  className="flex justify-center m-5">
            {
              submitted ?
                <div  className="bg-[#274059] rounded-2xl grid grid-cols-1 md:grid-cols-2 items-center h-[50vh] md:px-3 py-5 lg:w-fit">
                  {/* <div className="">
                    <CircularProgressbarWithChildren  className="h-40" value={7} styles={buildStyles({backgroundColor: '#00E5B9', pathColor: `rgba(240, 46, 101, ${80 / 100})`, trailColor: '#FFFFFF66', })} >
                      <h1 className="relative text-[#A7AEBE] flex flex-col">
                        <span className="relative text-[#F02E65] font-bold md:text-[50px]">{data.communityScore}</span>
                        <span>/ 89</span> 
                      </h1>
                    </CircularProgressbarWithChildren>
                  </div> */}

                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="circle absolute inset-0">
                        <div className="positives absolute inset-5 flex items-center justify-center text-white font-bold text-xl">
                          4
                        </div>
                        <div className="total absolute inset-5 flex items-center justify-center text-gray-400 font-bold text-xs">
                          / 89
                        </div>
                      </div>
                      <svg
                        id="circularProgressbar"
                        className="w-24 h-24"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="stroke-current text-pink-500"
                          cx="50"
                          cy="50"
                          r="45"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray="283"
                          strokeDashoffset="244"
                        ></circle>
                      </svg>
                    </div>
                  </div>

                  <div className="text-[25px] text-white font-semibold p-5 md:p-0">
                    <h1 className="">Title: <span className="text-[#b6cce2] font-normal">{data.title}</span></h1>
                    <h1 className="">URL: <span className="text-[#b6cce2] font-normal">{data.title}</span></h1>

                    {data.tags ?
                      <div>
                        <h1 className="">Threat tags: </h1>
                        <ul className="grid gap-2 md:grid-cols-3">
                          {data.tags.map((item, index) => (
                            <li key={index} className="text-white text-lg bg-[#F02E65] rounded-2xl px-2 py-1 w-fit">{item}</li>
                          ))}
                        </ul>
                      </div>
                      : ''
                  }
                    <h1 >Reported security vendors:</h1>
                    <ul>
                      <li className="text-[#00E5B9] text-lg bg-[#0E2439] rounded-2xl mt-2 px-2 py-1 w-fit">Avira</li>
                    </ul>
                  </div>
                </div>
                :
                <div className="bg-[#274059] rounded-2xl h-fit md:px-3 py-5 lg:w-1/2">
                  <div className="text-white  text-left p-5">
                      <h1 className="text-green text-2xl font-bold mb-2">What is LinkAlert?</h1>
                      <p className="text-lg font-medium">
                        LinkAlert is a powerful tool that helps you stay safe while browsing the web. It works by scanning links and URLs in real-time to detect any potential security threats.
                        Whether it's a phishing scam or a malware-laden website, LinkAlert will alert you to the danger and give you the option to avoid it.
                      </p>
                  </div>
                </div>
            }
            
        </div>
    </div>
  );
}

export default App;
