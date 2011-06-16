require "spec_helper"

describe CanvasesController do
  describe "routing" do

    it "routes to #index" do
      get("/canvases").should route_to("canvases#index")
    end

    it "routes to #new" do
      get("/canvases/new").should route_to("canvases#new")
    end

    it "routes to #show" do
      get("/canvases/1").should route_to("canvases#show", :id => "1")
    end

    it "routes to #edit" do
      get("/canvases/1/edit").should route_to("canvases#edit", :id => "1")
    end

    it "routes to #create" do
      post("/canvases").should route_to("canvases#create")
    end

    it "routes to #update" do
      put("/canvases/1").should route_to("canvases#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/canvases/1").should route_to("canvases#destroy", :id => "1")
    end

  end
end
