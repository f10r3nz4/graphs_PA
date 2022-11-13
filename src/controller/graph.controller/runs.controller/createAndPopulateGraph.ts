import createGraph from "ngraph.graph";
import { graphI } from "../../dao/dao.graphs/dao.graphs";


//il grafo alla creazione veniva solo salvato nel db, adesso con createGraph dalla libreria graph viene effettivamente creato
export const createAndPopulateGraph = async (graph: graphI) => {
    
    //creo il grafo e lo salvo nella costante
    const g = createGraph();
    //inizializzo il costo necessario alla creazione e quindi all'esecuzione
    let cost = 0;

    //aggiungo i nodi con il costo
    graph.nodes.map((node) => {
        console.log(`Added node: ${node.id}`);
        g.addNode(`${node.id}`);
        cost += 0.25;
    })

    //aggiungo gli archi con il costo
    graph.links.map((link: any) => {
        console.log(`Added link: from: ${link.node_from}, to: ${link.node_to}, weight: ${link.weight}`)
        g.addLink(`${link.node_from}`, `${link.node_to}`, { weight: link.weight });
        cost += 0.01;
    })


    return {
        g: g,
        cost: parseFloat(cost.toFixed(2)) 
    };
}