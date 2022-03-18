/*
  학력 컨트롤러, 클라이언트의 요청에 맞게 서비스로 해당 요청 전달 후 결과를 다시 응답하는 컨트롤러
  
  2022/03/17
  김보현
*/

import is from "@sindresorhus/is";
import { Router } from "express";
import { Education } from "../db";
import { login_required } from "../middlewares/login_required";
import { EducationService} from "../services/educationService"

const educationRouter = Router();
educationRouter.use(login_required);

// 학력 정보 create post 요청
educationRouter.post("/education/create", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const {user_id} = req.body;
    const {school} = req.body;
    const {major} = req.body;
    const {position} = req.body;

    const newEducation = await EducationService.addEducation({
      user_id,
      school,
      major,
      position
    });

    res.status(201).json(newEducation);
  } catch (error) {
    next(error);
  }
});

//학력 정보 유니크 id로 학력정보 찾기 
educationRouter.get("/educations/:id", async function(req, res, next){
  try{
    const educationId = req.params.id
    const education = await EducationService.getEducation({educationId})

    if(education.errorMessage){
      throw new Error(education.errorMessage)
    }

    res.status(200).send(education)
  }catch(error){
    next(error);
  };
});

// 특정 user_id를 이용해 학력 정보들을 찾기 위한 get요청
educationRouter.get("/educationlists/:user_id", async function (req, res, next) {
  try {
    const {user_id} = req.params;
    const educationList = await EducationService.getEducationList({ user_id });
    res.status(200).send(educationList);
  } catch (error) {
    next(error);
  }
})

// 학력 정보 id를 통해 put요청 (update)
educationRouter.put('/educations/:id', async function (req, res, next){
  try {
    const educationId = req.params.id;

    
    const school = req.body.school ?? null;
    const major = req.body.major ?? null;
    const position = req.body.position ?? null;

    const toUpdate = { 
      school,
      major,
      position
    };
    
    const education = await EducationService.setEducation({ educationId, toUpdate });

    if (education.errorMessage) {
      throw new Error(education.errorMessage);
    }

    res.status(200).send(education);
  } catch (error) {
    next(error);
  }
})



export {educationRouter}

