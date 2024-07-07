import React, { useRef, useState } from 'react'
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase"
import './Quiz.css'


const q = query(collection(db, "multiquestions"));
const querySnapshot = await getDocs(q);
//const data = []
const allDocs=querySnapshot.docs;
const shuffledDocs=shuffleArray(allDocs);

const selectedDocs=shuffledDocs.slice(0,5);
const data=selectedDocs.map(doc => ({
    question: doc.data().question,
    option1: doc.data().option1,
    option2: doc.data().option2,
    option3: doc.data().option3,
    option4: doc.data().option4,
    ans: doc.data().ans,
  
}));

function shuffleArray(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

const Quiz = () => {
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(data[index]);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [result, setResult] = useState(false);

  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let option_array = [Option1, Option2, Option3, Option4];



  const checkAns = (e, ans) => {
    if (lock === false) {
      if (question.ans == ans) {
        e.target.classList.add("correct");
        setLock(true);
        setScore(prev => prev + 1);
      }
      else {
        e.target.classList.add("wrong");
        setLock(true);
        option_array[question.ans - 1].current.classList.add("correct");

      }
    }
  }

  const next = () => {
    if (lock === true) {
      if (index === data.length - 1) {
        setResult(true);
        return 0;
      }
      setIndex(++index);
      setQuestion(data[index]);
      setLock(false);
      option_array.map((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
        return null;
      })
    }
  }
   const Back =()=>{

   }
  return (
    <div className='container'>
      <h1>MCQ</h1>
      <hr />
      {result ? <></> : <>
        <h2>{index + 1}.{question.question}</h2>
        <ul>
          <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
          <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question.option2}</li>
          <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
          <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
        </ul>
        <button onClick={next}>Next</button>
        <div className="index">{index + 1} of {data.length}</div>
      </>}
      {result ? <>
        <h3>Score is {score} out of {data.length}</h3>
      </> : <></>}

      <button onClick={Back}>Back</button>




    </div>
  )
}


export default Quiz

