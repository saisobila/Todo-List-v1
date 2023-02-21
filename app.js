//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://sudhakiran:sudha2025m@cluster2.znn9knl.mongodb.net/todolist')
const workItems = [];

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
  name: "welcome to your todo list",
});

const Item2 = new Item({
  name: "hit the + button to add a new item",
});

const Item3 = new Item({
  name: "<-- hit this to delete an item",
});

const defaultItems = [Item1, Item2, Item3];

// Item.insertMany(defaultItems, function(err){
//   if(err)
//   {
//     console.log(err);
//   }
//   else{
//     console.log("successfully inserted to the database");
//   }
// });

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved the default items into the db");
          res.redirect("/") 
        }
      });
    }
    else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {

  const ItemName = req.body.newItem;

  const item = new Item({
    name : ItemName
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", function(req,res){
  console.log(req.body.checkbox);

  const checkeditemId = req.body.checkbox;

  Item.findByIdAndRemove( checkeditemId , function(err, removedItem){
    if (err){
      console.log(err);
    }
    else{
      console.log("succcefully deleted from the database");
    res.redirect("/")
    }
  })

});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully");
});
