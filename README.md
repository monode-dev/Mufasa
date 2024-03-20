# Mufasa

An easy way to connect your database to your UI. (AKA a strongly typed, local-first ORM)

Features:

- Fully Reactive
- Supports both documents and files
- Changes can be made offline and will be synced later
- Provides good defaults but is highly customizable
- Should work with any front-end, back-end, or platform (only tested with Solid JS, Firebase, and Capacitor JS)

## Quick Start

#### Set Up Mufasa

Install Mufasa via `npm i mufasa`. To update to the latest version run `npm i mufasa@latest`.

Import and initialize Mufasa anywhere in your app.

```ts
import { initializeMufasa } from "mufasa";
import { solidMosa } from "miwi";
import { capacitorJsonPersister } from "mufasa/capacitor";
import { firestoreDocPersister } from "mufasa/firebase";

// Export "MfsDoc" so it can be used in other files too.
export const { MfsDoc } = initializeMufasa({
  getDefaultPersistersFromDocType: (docType) => {
    const stagedName = `${import.meta.env.PROD ? `Prod` : `Dev`}_${docType}`;
    return {
      // Connect to front-end
      sessionInterface: solidMosa,
      // Connect to local file system
      localJsonPersister: capacitorJsonPersister(`${stagedName}.json`),
      // Connect to database
      globalDocPersister: firestoreDocPersister(
        collection(firestore, stagedName),
      ),
    };
  },
});
```

#### Define Document Types

Define your document types in any file.

```ts
import { prop, list, formula } from "mufasa";

export class Course extends MfsDoc(`Course`) {
  // Use `prop(TypeClass)` to specify a property that will be saved to the database
  name = prop(String);

  // An initial value can be specified
  description = prop(String, ``);

  // Props can reference document types
  teacher = prop(Teacher);

  // Use `[TypeClass, null]` to define a nullable prop
  teachersAssistant = prop([Student, null], null);

  // Use `list(DocClass)` to define a document list
  readonly students = list(Student);
}

export class Teacher extends MfsDoc(`Teacher`) {
  firstName = prop(String);
  lastName = prop(String);
  // Use formula to make reactive, read-only props
  readonly fullName = formula(() => `${this.firstName} ${this.lastName}`);

  // `list(DocClass, "propName") can be used to define one-to-many lists
  readonly courses = list(Course, `teacher`);
}

export class Student extends MfsDoc(`Student`) {
  firstName = prop(String);
  lastName = prop(String);
  readonly fullName = formula(() => `${this.firstName} ${this.lastName}`);

  // `list(DocClass, "propName") to define many-to-many lists
  readonly courses = list(Course, `students`);
}
```

#### Use Documents in your UI

```tsx
import { Teacher } from "./Teacher";
import { Course } from "./Course";
import { For } from "solid-js";

function TeacherUI(teacher: Teacher) {
  return (
    <div>
      {/* Will automatically update when this device or any other device renames the teacher. */}
      <h1>{teacher.fullName}</h1>
      <button
        onClick={() => {
          // Documents must be created using the `create` method
          Course.create({
            name: `Math 101`,
            teacher: teacher,
          });
        }}
      >
        Add Course
      </button>
      <button
        onClick={() => {
          /* Simply assign to a prop and the update will be sent to the database
           * and then to any other mobile devices that are listening. */
          student.lastName = ``;
        }}
      >
        Change Last Name
      </button>
      <For each={teacher.courses}>{(course) => <li>{course.name}</li>}</For>
    </div>
  );
}
```

#### See More

That should be enough to get you something useful. For more take a look at the "Deep Dive" section.

## Deep Dive
