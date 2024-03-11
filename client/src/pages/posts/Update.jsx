import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { DangerAlert } from "../../Components/CustomAlert.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePost } from "../../controllers/postController.js";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";

const Update = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    title: state.title,
    image: state.image,
    body: state.body,
  });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updatePost(
        state._id,
        formData.title,
        formData.image,
        formData.body
      );
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setformData({ ...formData, image: base64 });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <Container>
      <Card className="bg-body-tertiary">
        <Card.Body>
          <Card.Title>Update your post</Card.Title>
          <Card.Body>
            <div className="d-flex">
              <div style={{ height: "300px" }}>
                <InputGroup className="mb-3">
                  <InputGroup.Text className="bg-white bi bi-image"></InputGroup.Text>
                  <Form.Control
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleFileUpload(e)}
                  />
                </InputGroup>
                {formData.image && (
                  <Image
                    thumbnail
                    src={formData.image}
                    className="object-fit-contain mb-3 h-100"
                  ></Image>
                )}
              </div>
              <div className="ps-3 w-100">
                <FloatingLabel label="Post Title" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Post Title"
                    value={formData.title}
                    onChange={(e) =>
                      setformData({ ...formData, title: e.target.value })
                    }
                  />
                </FloatingLabel>
                <FloatingLabel label="Post Content" className="mb-3">
                  <Form.Control
                    as="textarea"
                    style={{ height: "280px" }}
                    placeholder="Post Content"
                    value={formData.body}
                    onChange={(e) =>
                      setformData({ ...formData, body: e.target.value })
                    }
                  />
                </FloatingLabel>
              </div>
            </div>
          </Card.Body>
          <Button
            disabled={loading}
            variant="primary"
            className="d-flex ms-auto"
            onClick={handleUpdate}
          >
            {loading ? "Loading…" : "Update"}
          </Button>
          {error && <DangerAlert error={error} />}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Update;
