- ### Build

  - In the folder `src/lambda`
    ```
    cd src/lambda
    ```
  - Remove all existing built files to avoid any unexpected results
    ```
    rm -rf build *.zip
    ```
  - Build the `zip` file for Lambda functions. The command is:

    ```
    npm run build-lambda -- --file-path src/lambda/libraryReminders.ts --zip-file-name library_reminders.zip
    ```

- ### Update to AWS

  Update the Lambda function, `cfcberkeley_church_library_reminders`, with `zip` files built above:

- ### Re-trigger a AWS run

  Go to the AWS Lambda function `cfcberkeley_church_library_reminders` "Test" tab, and trigger a test.

- ### Debug command

  May need to add `exports.handler();` at the end of the debugging script to actually run the script.
