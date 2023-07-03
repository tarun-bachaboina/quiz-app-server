import { Router } from "express";
import * as controller from '../controllers/controller.js';


const router = Router();

// Questions Routes API 
router.route('/questions')
      .get(controller.getQuestions) // GET Request */
      .post(controller.insertQuestions) // POST Request */
      .delete(controller.dropQuestions) // DELETE Request */

// Result Routes API 
router.route('/result')
      .get(controller.getResult)
      .post(controller.storeResult)
      .delete(controller.dropResult)

export default router;