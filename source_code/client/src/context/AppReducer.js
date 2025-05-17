export default function AppReducer(state, action) {
  switch (action.type) {
    case "RENDER_QUESTIONS":
      return {
        ...state,
        dataStructureName: action.payload.name,
        dataStructureId: action.payload.id,
        authenticated: action.payload.authenticated,
      };

    case "RENDER_SOLVE_CHALLENGES":
      return {
        ...state,
        questionId: action.payload.quesId,
        question: action.payload.question,
        difficulty: action.payload.difficulty,
        link: action.payload.link,
      };

    default:
      return state;
  }
}
