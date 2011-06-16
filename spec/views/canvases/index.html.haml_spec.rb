require 'spec_helper'

describe "canvases/index.html.haml" do
  before(:each) do
    assign(:canvases, [
      stub_model(Canvas),
      stub_model(Canvas)
    ])
  end

  it "renders a list of canvases" do
    render
  end
end
