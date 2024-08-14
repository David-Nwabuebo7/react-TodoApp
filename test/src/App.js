import "./App.css";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
function App() {
  // const  StoredTodoList = localStorage.getItem('Todo')
  //console.log([].length||StoredTodoList);
  const NewList = JSON.parse(localStorage.getItem("todos"));
  console.log(NewList);

  const NewTodos = NewList ? NewList : [];
  const [Todo, setTodo] = useState(NewTodos);
  // new task will hold new data
  const [newTask, setnewTask] = useState("");
  // update task will hold task that is being edited
  const [updatedata, Setupdatedata] = useState("");
  const [Updateinput, SetInputState] = useState(true);

  function GrabListfromLocalStorage() {
    if (Todo.length) {
      localStorage.setItem("todos", JSON.stringify(Todo), () => {
        console.log("localStorage updated successfully");
      });
    }
  }
  useEffect(() => {
    GrabListfromLocalStorage();
  }, [Todo]);

  function Addtask() {
    if (newTask) {
      const  num = Todo.length + 1;
      setTodo((prev) => {
        return [...prev, { id: num, title: newTask, status: false }];
      });
      /* this is very important to empty the  input before rendering another value*/
      setnewTask("");
    }
  }

  function MarkTask(id) {
    let grabTask = Todo.map((task) => {
      if (task.id === id) {
        return { ...task, status: !task.status };
      }
      return task;
    });
    setTodo(grabTask);
  }

  function DeleteTask(id) {
    let grabTask = Todo.filter((task) => task.id !== id);
    setTodo(grabTask);
    const todoToRemove = Todo.find((todo) => todo.id === id);
    if (todoToRemove) {
      const updatedTodoList = Todo.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodoList));
    }
  }

  function cancelUpdate() {
    Setupdatedata("");
  }

  function Changetask(value) {
    let newEntry = {
      id: updatedata.id,
      title: value,
      status: updatedata.status ? true : false,
    };
    Setupdatedata(newEntry);
  }

  // handle your repeatinq umupdated  tasked, make the previous value disappear
  function UpdateTask() {
    const index = Todo.findIndex((item) => item.id === updatedata.id);
    if (index !== -1) {
      // Check if the item exists
      const updatedTodo = { ...Todo[index], title: updatedata.title };
      setTodo([...Todo.slice(0, index), updatedTodo, ...Todo.slice(index + 1)]);
    }
    Setupdatedata(""); // Clear update data after successful update
    SetInputState(true); // Enable input again
  }

  function Prevent(e) {
    e.preventDefault();
  }

  function HandleUpdatePen(item) {
    Setupdatedata({
      id: item.id,
      title: item.title,
      status: item.status ? true : false,
    });

    SetInputState(false);
  }

  let diplayer =
    Todo &&
    Todo.sort((a, b) => (a.id > b.id ? 1 : -1)).map((item, index) => {
      return (
        <React.Fragment key={item.id}>
          <div className="col taskBg">
            <div className={item.status ? "done" : ""} id="inside">
              <span className="taskNumber">{index + 1}</span>
              <span className="taskText">{item.title}</span>
            </div>
            <div className="iconsWrap">
              <span
                title="completed / Not completed"
                onClick={() => MarkTask(item.id)}
              >
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  bounce
                  className="icons"
                />
              </span>
              {item.status ? null : (
                <span
                  className="icons"
                  title="Edit"
                  onClick={() => HandleUpdatePen(item)}
                >
                  <FontAwesomeIcon icon={faPen} beat className="icons" />
                </span>
              )}

              <span onClick={() => DeleteTask(item.id)}>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  shake
                  className="icons"
                  title="Delete"
                />
              </span>
            </div>
          </div>
        </React.Fragment>
      );
    });
  let NoTaskColor = {
    color: "black",
    backgroundColor: "#ffc107",
    fontSize: 17 + "px",
    padding: 3 + "px",
    fontWeight: 100 + "px",
  };
  let situation = Todo && Todo.length ? diplayer : "No Tasks...";
  let Falsecolorer = Todo && Todo.length ? null : NoTaskColor;

  return (
    <div className=" container App">
      <form onSubmit={Prevent}>
        <nav className="topic">
          <br />
          <br />
          <h1>To Do List App (ReactJs)</h1>
          <br />
          <br />
          {/* Add task */}
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control form-control-lg"
                value={newTask}
                onChange={(e) => setnewTask(e.target.value)}
                placeholder="Add Task.."
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-lg btn-success" onClick={Addtask}>
                Add Task
              </button>
            </div>
          </div>
          <br />
          {/* update task */}
          <div className="row">
            <div className="col ">
              <input
                className="form-control form-control-lg"
                value={updatedata && updatedata.title}
                onChange={(e) => Changetask(e.target.value)}
                placeholder="Update Task.."
                disabled={Updateinput}
              />
            </div>
            <div className="col-auto">
              <button
                className="btn btn-lg btn-success nr-20"
                onClick={UpdateTask}
              >
                Update
              </button>
              <button className="btn btn-lg btn-warning" onClick={cancelUpdate}>
                Cancel
              </button>
            </div>
          </div>
          <br />
        </nav>

        <span style={Falsecolorer}>{situation}</span>
      </form>
    </div>
  );
}

export default App;
