app.post("/add_user", async (request, response) => {
    const user = new userModel(request.body);

    console.log("req.body" + request.body)
  
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});