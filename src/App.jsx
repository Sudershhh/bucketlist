import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl, uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

console.log("Client initialized:", client);
console.log("Client models:", client.models);

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setIsLoading(true);
      const { data: items } = await client.models.BucketList.list();
      await Promise.all(
        items.map(async (item) => {
          if (item.image) {
            const linkToStorageFile = await getUrl({
              path: ({ identityId }) => `media/${identityId}/${item.image}`,
            });
            item.image = linkToStorageFile.url;
          }
          return item;
        })
      );
      setItems(items);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bucket list items");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function createItem(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const form = new FormData(event.target);
      const imageFile = form.get("image");

      const { data: newItem } = await client.models.BucketList.create({
        title: form.get("title"),
        description: form.get("description"),
        image: imageFile.name || null,
      });

      if (imageFile.name) {
        await uploadData({
          path: ({ identityId }) => `media/${identityId}/${newItem.image}`,
          data: imageFile,
        }).result;
      }

      await fetchItems();
      event.target.reset();
    } catch (err) {
      setError("Failed to create bucket list item");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteItem({ id }) {
    try {
      await client.models.BucketList.delete({ id });
      await fetchItems();
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    }
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="App">
          <header className="app-header">
            <div className="header-content">
              <Heading level={1}>My Bucket List</Heading>
              <Button onClick={signOut} className="sign-out-button">
                Sign Out
              </Button>
            </div>
          </header>
          {error && <div className="error-message">{error}</div>}

          <View as="form" onSubmit={createItem} className="create-form">
            <Heading level={3}>Add New Dream</Heading>
            <TextField
              name="title"
              placeholder="What's your dream?"
              label="Dream Title"
              isRequired={true}
              className="form-input"
              disabled={isSubmitting}
            />
            <TextField
              name="description"
              placeholder="Tell us more about it..."
              label="Description"
              isRequired={true}
              className="form-input"
              disabled={isSubmitting}
            />
            <div className="file-input-container">
              <label htmlFor="image">Add an Image</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/png, image/jpeg"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              variation="primary"
              isLoading={isSubmitting}
              loadingText="Adding dream..."
              className="submit-button"
            >
              {isSubmitting ? "Adding..." : "Add to Bucket List"}
            </Button>
          </View>

          <Divider />

          <Heading level={2}>My Dreams & Goals</Heading>

          {isLoading ? (
            <div className="loading-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="box loading-box">
                  <div className="loading-content" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Text>No dreams added yet. Start adding some!</Text>
            </div>
          ) : (
            <div className="amplify-grid">
              {items.map((item) => (
                <Flex key={item.id} className="box">
                  <div className="box-content">
                    <Heading level={3}>{item.title}</Heading>
                    <Text className="description">{item.description}</Text>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={`Visual for ${item.title}`}
                        className="dream-image"
                      />
                    )}
                    <Button
                      variation="destructive"
                      onClick={() => deleteItem(item)}
                      className="delete-button"
                    >
                      Delete Dream
                    </Button>
                  </div>
                </Flex>
              ))}
            </div>
          )}
        </div>
      )}
    </Authenticator>
  );
}
