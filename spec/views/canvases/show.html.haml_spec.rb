require 'spec_helper'

describe "canvases/show.html.haml" do
  before(:each) do
    @canvas = assign(:canvas, stub_model(Canvas))
  end

  it "renders attributes in <p>" do
    render
  end
end
