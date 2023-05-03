import GraphModal from "graph-modal";
document.querySelector(".clients__btn-new").addEventListener("click", () => {
  new GraphModal().open("newClient");
});
