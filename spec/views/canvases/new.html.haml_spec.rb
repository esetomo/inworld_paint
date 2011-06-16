require 'spec_helper'

describe "canvases/new.html.haml" do
  before(:each) do
    assign(:canvas, stub_model(Canvas).as_new_record)
  end

  it "renders new canvas form" do
    render

    rendered.should have_selector("form", :action => canvases_path, :method => "post") do |form|
    end
  end
end
