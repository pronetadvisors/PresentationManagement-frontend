import { defineStore } from "pinia";
import { notify } from "@kyvg/vue3-notification";
import { Api } from "../helpers/axios";

export const usePresentationStore = defineStore("presentation", {
  state: () => ({
    presentations: [],
    uploading: [],
    sponsors: [],
    token: null,
  }),
  getters: {
    getPresentations: (state) => state.presentations,
    getSponsors: (state) => state.sponsors,
    getToken: (state) => state.token,
    getLocation(state) {
      const locations = [];
      state.presentations.forEach((presentation) => {
        if (!locations.includes(presentation.location)) {
          locations.push(presentation.location);
        }
      });
      return locations;
    },
    getUploading: (state) => state.uploading,
  },
  actions: {
    logout() {
      this.$reset();
    },
    async updateDB() {
      Api.get("/presentation/").then((response) => {
        this.presentations = response.data.presentations;
      });
      Api.get("/settings/sponsor/").then((response) => {
        const temp = response.data.sponsors;
        if (temp == null) return;
        temp.forEach((sponsor) => {
          this.sponsors.push({
            sponsor,
            active: false,
          });
        });
      });
    },
    async createPresentation(presentation) {
      Api.post("/presentation/", presentation)
        .then(() => {
          notify({
            type: "success",
            title: "New Presentation Created",
            text: `The presentation has successfully been added.`,
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    async updatePresentation(id, presentation) {
      Api.put(`/presentation/${id}`, presentation)
        .then(() => {
          this.updateDB();
          notify({
            type: "success",
            title: "Presentation Updated",
            text: `The presentation has successfully been updated.`,
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    async deletePresentation(id) {
      Api.delete(`/presentation/${id}`)
        .then(() => {
          this.updateDB();
          notify({
            type: "success",
            title: "The presentation has been deleted.",
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    async uploadPowerpoint(session_id, powerpoint) {
      Api.put(`/presentation/pp/${session_id}`, powerpoint, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          this.updateDB();
          notify({
            type: "success",
            title: "Presentation uploaded.",
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    async deletePowerpoint(id) {
      const index = this.uploading.indexOf(id);
      if (index > -1) {
        // only splice array when item is found
        this.uploading.splice(index, 1); // 2nd parameter means remove one item only
      }
      Api.delete(`/presentation/pp/${id}`)
        .then(() => {
          this.updateDB();
          notify({
            type: "success",
            title: "The presentation file has been deleted.",
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    async uploadSponsor(sponsor) {
      Api.put(`/settings/sponsor/`, sponsor, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          this.updateDB();
          notify({
            type: "success",
            title: "Sponsor uploaded.",
          });
        })
        .catch((err) => {
          notify({
            type: "error",
            title: `Error Code: ${err.response.status}`,
            text: err.response.data.error,
          });
        });
    },
    getPresentationsAt(selectedLocation) {
      const presentationsAtLocation = [];
      this.presentations.forEach((presentation) => {
        if (presentation.location === selectedLocation.value) {
          presentationsAtLocation.push(presentation);
        }
      });

      presentationsAtLocation.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      return presentationsAtLocation;
    },
    addUploading(id) {
      this.uploading.push(id);
    },
  },
});
