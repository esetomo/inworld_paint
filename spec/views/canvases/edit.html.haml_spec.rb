require 'spec_helper'

describe "canvases/edit.html.haml" do
  before(:each) do
    @canvas = assign(:canvas, stub_model(Canvas))
  end

  it "renders the edit canvas form" do
    render

    rendered.should have_selector("form", :action => canvas_path(@canvas), :method => "post") do |form|
    end
  end
end
