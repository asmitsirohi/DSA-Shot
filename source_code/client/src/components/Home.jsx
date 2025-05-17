import React from "react";
import { Route, Switch } from "react-router-dom";
import { GlobalProvider } from "../context/GlobalState";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import About from "./About";
import Questions from "./Questions";
import AdminDashboard from "./Admin/Dashboard";
import AddQuestions from "./Admin/AddQuestions";
import AddDataStructure from "./Admin/AddDataStructure";
import Roles from "./Admin/Roles";
import SolveChallenge from "./SolveChallenge";
import ManageDataStructure from "./Admin/ManageDataStructure";
import ManageQuestions from "./Admin/ManageQuestions";
import SecuredRoute from "./SecuredRoute";
import AdminRoute from "./Admin/AdminRoute";
import Setting from "./Setting";
import Booksmarks from "./Booksmarks";

const Home = () => {
  return (
    <>
      <GlobalProvider>
        <Navbar />
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/setting" component={Setting} />
          <Route exact path="/about" component={About} />
          <Route exact path="/questions/:DSName/:DSId" component={Questions} />
          <SecuredRoute
            exact
            path="/solvechallenge/:DSName/:DSId/:quesId"
            component={SolveChallenge}
          />
          <SecuredRoute exact path="/bookmarks" component={Booksmarks} />
          <AdminRoute
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />
          <AdminRoute
            exact
            path="/admin/addquestions"
            component={AddQuestions}
          />
          <AdminRoute
            exact
            path="/admin/managequestions"
            component={ManageQuestions}
          />
          <AdminRoute exact path="/admin/roles" component={Roles} />
          <AdminRoute
            exact
            path="/admin/adddatastructure"
            component={AddDataStructure}
          />
          <AdminRoute
            exact
            path="/admin/managedatastructure"
            component={ManageDataStructure}
          />
        </Switch>
      </GlobalProvider>
    </>
  );
};

export default Home;
