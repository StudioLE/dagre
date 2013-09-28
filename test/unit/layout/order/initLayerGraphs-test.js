var assert = require("../../assert"),
    CDigraph = require("graphlib").CDigraph,
    initLayerGraphs = require("../../../../lib/layout/order/initLayerGraphs");

describe("initLayerGraphs", function() {
  var g;

  beforeEach(function() {
    g = new CDigraph();
    g.graph({});
  });

  it("constructs a 1-level graph for a flat graph", function() {
    g.addNode(1, { rank: 0 });
    g.addNode(2, { rank: 0 });
    g.addNode(3, { rank: 0 });

    initLayerGraphs(g);

    var layerGraphs = g.graph().layerGraphs;
    assert.isDefined(layerGraphs);
    assert.lengthOf(layerGraphs, 1);
    assert.sameMembers(layerGraphs[0].nodes(), [1, 2, 3]);
    assert.sameMembers(layerGraphs[0].children(null), [1, 2, 3]);
  });

  it("constructs a 2-level graph for a single layer", function() {
    g.addNode(1, { rank: 0 });
    g.addNode(2, { rank: 0 });
    g.addNode(3, { rank: 0 });
    g.addNode("sg1", {});
    g.parent(2, "sg1");

    initLayerGraphs(g);

    var layerGraphs = g.graph().layerGraphs;
    assert.isDefined(layerGraphs);
    assert.lengthOf(layerGraphs, 1);
    assert.sameMembers(layerGraphs[0].nodes(), [1, 2, 3, "sg1"]);
    assert.sameMembers(layerGraphs[0].children(null), [1, 3, "sg1"]);
    assert.sameMembers(layerGraphs[0].children("sg1"), [2]);
  });

  it("constructs 2 layers for a 2-layer graph", function() {
    g.addNode(1, { rank: 0 });
    g.addNode(2, { rank: 0 });
    g.addNode(3, { rank: 0 });
    g.addNode(4, { rank: 1 });
    g.addNode(5, { rank: 1 });
    g.addNode("sg1", {});
    g.parent(2, "sg1");
    g.parent(5, "sg1");

    initLayerGraphs(g);

    var layerGraphs = g.graph().layerGraphs;
    assert.isDefined(layerGraphs);
    assert.lengthOf(layerGraphs, 2);

    assert.sameMembers(layerGraphs[0].nodes(), [1, 2, 3, "sg1"]);
    assert.sameMembers(layerGraphs[0].children(null), [1, 3, "sg1"]);
    assert.sameMembers(layerGraphs[0].children("sg1"), [2]);

    assert.sameMembers(layerGraphs[1].nodes(), [4, 5, "sg1"]);
    assert.sameMembers(layerGraphs[1].children(null), [4, "sg1"]);
    assert.sameMembers(layerGraphs[1].children("sg1"), [5]);
  });

  it("handles multiple nestings", function() {
    g.addNode(1, { rank: 0 });
    g.addNode(2, { rank: 0 });
    g.addNode(3, { rank: 0 });
    g.addNode(4, { rank: 1 });
    g.addNode(5, { rank: 1 });
    g.addNode(6, { rank: 1 });
    g.addNode("sg1", {});
    g.addNode("sg2", {});
    g.parent(1, "sg2");
    g.parent(4, "sg2");
    g.parent(2, "sg1");
    g.parent(5, "sg1");
    g.parent("sg2", "sg1");

    initLayerGraphs(g);

    var layerGraphs = g.graph().layerGraphs;
    assert.isDefined(layerGraphs);
    assert.lengthOf(layerGraphs, 2);

    assert.sameMembers(layerGraphs[0].nodes(), [1, 2, 3, "sg1", "sg2"]);
    assert.sameMembers(layerGraphs[0].children(null), [3, "sg1"]);
    assert.sameMembers(layerGraphs[0].children("sg1"), [2, "sg2"]);
    assert.sameMembers(layerGraphs[0].children("sg2"), [1]);

    assert.sameMembers(layerGraphs[1].nodes(), [4, 5, 6, "sg1", "sg2"]);
    assert.sameMembers(layerGraphs[1].children(null), [6, "sg1"]);
    assert.sameMembers(layerGraphs[1].children("sg1"), [5, "sg2"]);
    assert.sameMembers(layerGraphs[1].children("sg2"), [4]);
  });
});
