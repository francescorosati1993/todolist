import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class Prova extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <>
                <h2>React Fragments</h2>
               <p>Anziché scrivere il tag div o altri tag come contenitori per il return, si possono usare i tag vuoti (fragments: frammenti).
               Così non c'è l'obbligo di "avvolgere" tutti i tag del return in un elemento padre.</p>
            </>
        );
    }

}

export default Prova;