### General information
````
In this project I used node.js to make operation with database(MongoDB).
I worked with "students" collection in "local" database.
````

### Installation
1. Clone repo
2. Open project directory
3. run ```npm install``` command
3. run ```node app.js``` command


#### Data
````
- Import all data from students.json into student collection
````

#### What I have done
````
- Found all students who have the worst score for homework, sort by descent
- Found all students who have the best score for quiz and the worst for homework, sort by ascending
- Found all students who have best score for quiz and exam
- Calculated the average score for homework for all students
- Deleted all students that have homework score <= 60
- Marked students that have quiz score => 80
- Wrote a query that divides students by 3 categories (calculated the average grade for three subjects)
  - a => (between 0 and 40)
  - b => (between 40 and 60)
  - c => (between 60 and 100)
````
