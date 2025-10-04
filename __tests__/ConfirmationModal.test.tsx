// src/modals/ConfirmationModal.test.tsx
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ConfirmationModal } from "@/modals/ConfirmationModal";


vi.mock("@/components/ui/Buttons/DifficultyActionButton", () => ({
  DifficultyActionButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("ConfirmationModal", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "auto";
  });

  it("does not render when visible is false", () => {
    render(
      <ConfirmationModal
        visible={false}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders title and message when visible is true", () => {
    render(
      <ConfirmationModal
        visible={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("renders confirm and cancel buttons with provided text", () => {
    render(
      <ConfirmationModal
        visible={true}
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal
        visible={true}
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmationModal
        visible={true}
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("uses default button texts if not provided", () => {
    render(
      <ConfirmationModal
        visible={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("sets accessibility attributes correctly", () => {
    render(
      <ConfirmationModal
        visible={true}
        title="A"
        message="B"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "confirmation-title");
    expect(dialog).toHaveAttribute("aria-describedby", "confirmation-message");
  });

  it("locks body scroll when visible", () => {
  const { rerender } = render(
    <ConfirmationModal
      visible={true}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );
  expect(document.body.style.overflow).toBe("hidden");
  
  rerender(
    <ConfirmationModal
      visible={false}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );
  expect(document.body.style.overflow).toBe("auto");
});
});