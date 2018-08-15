let m = require("mithril")
let underscore = require("underscore")
let Datastore = require('nedb')
let db = new Datastore({ filename: './store/data.db', autoload: true })


//let notes = []
let inputvalue = ""
let notes = []

function getValues(){
    db.find({}, function (err, dbnotes) {
        console.log(dbnotes)
        let sortedbydates = underscore.groupBy(dbnotes, (n)=>n.date.toDateString())
        notes = underscore.pairs(sortedbydates)
        m.redraw()
    })
}
getValues()

const Notes = () =>{
    return {
        view: () => {
            return m(".notes", {}, notes.map(d=>{
                return m(".dategroup",[
                    m(".date",d[0]),
                    d[1].map((n)=>{
                        return m(".note",n.date.toLocaleTimeString().slice(0,5)+" - "+n.value)
                    })
                ])
            }))
        }
    }
}

const Input = () =>{
    function setValue(e){
        inputvalue = e.target.value
    }

    function storeValue(e){
        if(e.key === "Enter"){

            db.insert({
                date: new Date(),
                value: inputvalue
            }, function (err, newDoc) {   // Callback is optional
                if (err) throw err
                getValues()
            });

            inputvalue = ""
        }
    }
    return {
        view: () => {
            return m("main", {

            },[
                m("input",{
                    value: inputvalue,
                    oninput: setValue,
                    onkeypress: storeValue
                })
            ])
        }
    }
}

const App = () =>{
    return {
        view: () => {
            return m("main", [
                m(Notes),
                m(Input),
            ])
        }
    }
}


m.mount(document.body, App)
