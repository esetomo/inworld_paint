require 'spec_helper'

describe "textures/show.html.haml" do
  before(:each) do
    @texture = assign(:texture, stub_model(Texture))
  end

  it "renders attributes in <p>" do
    render
  end
end
