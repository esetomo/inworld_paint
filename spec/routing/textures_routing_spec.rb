require "spec_helper"

describe TexturesController do
  describe "routing" do

    it "routes to #index" do
      get("/canvases/2/textures").should route_to("textures#index", :canvas_id => "2")
    end

    it "routes to #new" do
      get("/canvases/2/textures/new").should route_to("textures#new", :canvas_id => "2")
    end

    it "routes to #show" do
      get("/canvases/2/textures/1").should route_to("textures#show", :id => "1", :canvas_id => "2")
    end

    it "routes to #edit" do
      get("/canvases/2/textures/1/edit").should route_to("textures#edit", :id => "1", :canvas_id => "2")
    end

    it "routes to #create" do
      post("/canvases/2/textures").should route_to("textures#create", :canvas_id => "2")
    end

    it "routes to #update" do
      put("/canvases/2/textures/1").should route_to("textures#update", :id => "1", :canvas_id => "2")
    end

    it "routes to #destroy" do
      delete("/canvases/2/textures/1").should route_to("textures#destroy", :id => "1", :canvas_id => "2")
    end

  end
end
