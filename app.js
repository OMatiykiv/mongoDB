const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'local';

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true}, async function(err, client) {
    const db = client.db(dbName);
    const students = db.collection('students');

// Find all students who have the worst score for homework, sort by descent
    students.aggregate(
        {$match: 
            {"scores":
                {$elemMatch:
                    {score: {$lt: 40}, type: "homework"}
                }
            }
        },
        {$sort: 
            {"scores.2.score": -1}
        }
    )

//Find all students who have the best score for quiz and the worst for homework, sort by ascending
    students.aggregate(
        {$match: 
            {$and:
            [{"scores":
                {$elemMatch:
                    {score: {$gte: 60}, type: "quiz"}
                }
            },
            {"scores":
                {$elemMatch:
                    {score: {$lt: 40}, type: "homework"}
                }
            }]}
        },
        {$sort: 
            {"scores.1.score": 1, "scores.2.score": 1}
        }
    )    
    
// Find all students who have best scope for quiz and exam
    students.aggregate(
        {$match: 
            {$and:
                [{"scores":{$elemMatch:{score: {$gte: 60}, type: "exam"}}},
                {"scores":{$elemMatch:{score: {$gte: 60}, type: "quiz"}}}]
            }
        }
    )

// Calculate the average score for homework for all students
    students.aggregate(
        { $unwind: '$scores' },
        { $match: 
                {"scores.type": "homework"}
        },
        {$group: 
            {_id: "Avarage homework",
             avgAm: { $avg: "$scores.score" }
           }
        }
    )

//Delete all students that have homework score <= 60
    students.deleteMany(
        {"scores":
            {$elemMatch:
                {score: {$lte: 60}, type: "homework"}
            }
        }
    )

//Mark students that have quiz score => 80
    //in case we don't need to update
    students.aggregate(
        {$match:
            {"scores":
                {$elemMatch:
                    {score: {$gte: 80}, type: "quiz"}
                }
            }
        },
        {$addFields: 
            {"mark": "quiz over 80"}
        }
    )

    //in case we need to update
    students.updateMany(
        {"scores":
            {$elemMatch:
                {score: {$gte: 80}, type: "quiz"}
            }
        },
        {$set:
            {"mark": "quiz over 80"}
        }
    )

//Write a query that group students by 3 categories (calculate the average grade for three subjects)
//   - a => (between 0 and 40)
//   - b => (between 40 and 60)
//   - c => (between 60 and 100)
    students.aggregate(
        { $unwind: '$scores' },
        {$group:
             {
               _id: "$_id",
               name: { $first: '$name' },
               avrg: {$avg: "$scores.score"}
             }
        },
        {$project: 
            {
            _id: 1,
            name: 1,
            avrg:1,
            category: 
                {$switch: 
                    {branches: [
                        { case: { $lt:["$avrg", 40]}, then: "a" },
                        { case: { $gte:["$avrg", 60]}, then: "c" }
                        ],
                    default: "b"
                    }
                }
            }
        }
    )



    .each((err, doc) =>{
        console.log(doc)
    }).finally(() => {
        client.close();
    })
})
