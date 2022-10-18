import { QueryClient } from "react-query";
import { createStandaloneToast } from "@chakra-ui/react";
import { theme } from "../theme";

const toast = createStandaloneToast({ theme });

//쿼리 에러 통합 관리
function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : "error connecting to server";

  toast.closeAll(); // prevent duplicate toasts
  toast({ title, status: "error", variant: "subtle", isClosable: true });
}

export const queryClient = new QueryClient({
    defaultOptions : {
        queries : {
            onError : queryErrorHandler,
        }
    }
});
